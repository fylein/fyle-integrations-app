import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QwcFlowState, QwcRegenerationFlowType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-qwc-file.model';
import { QbdDirectPrerequisitesV2Component } from '../../qbd-direct-prerequisites-v2/qbd-direct-prerequisites-v2.component';
import { TranslocoService } from '@jsverse/transloco';
import { brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppName, QBDConnectionStatus, QbdDirectOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QbdDirectDownloadFileComponent } from "../../qbd-direct-download-file/qbd-direct-download-file.component";
import { QbdDirectSetupConnectionComponent } from '../../qbd-direct-setup-connection/qbd-direct-setup-connection.component';
import { QbdDirectConnectorService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-connector.service';
import { QbdConnectorGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';
import { downloadXMLFile } from 'src/app/core/util/downloadFile';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { CheckBoxUpdate } from 'src/app/core/models/common/helper.model';
import { interval, Observable, switchMap, takeWhile } from 'rxjs';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { QbdDirectWorkspace } from 'src/app/core/models/qbd-direct/db/qbd-direct-workspaces.model';

@Component({
  selector: 'app-qbd-direct-regenerate-qwc-file',
  imports: [
    SharedModule,
    QbdDirectPrerequisitesV2Component,
    QbdDirectDownloadFileComponent,
    QbdDirectSetupConnectionComponent
  ],
  templateUrl: './qbd-direct-regenerate-qwc-file.component.html',
  styleUrl: './qbd-direct-regenerate-qwc-file.component.scss'
})
export class QbdDirectRegenerateQwcFileComponent implements OnInit {
  // Component state
  isLoading: boolean = false;

  flowType: QwcRegenerationFlowType;

  xmlFileContent = '';

  state = signal(QwcFlowState.PREREQUISITES);

  isCompanyPathInvalid = signal(false);

  // TODO: update on init (existing file path)
  password = signal('');

  connectionStatus = computed(() => {
    switch (this.state()) {
      case QwcFlowState.CONNECTION_DONE:
        return QBDConnectionStatus.SUCCESS;
      default:
        return QBDConnectionStatus.INCORRECT_COMPANY_PATH;
    }
  });

  isDialogVisible = signal(false);

  warningDialogText = signal('');

  // Constants for template
  readonly QwcFlowState = QwcFlowState;

  readonly brandingStyle = brandingStyle;

  readonly appName = AppName.QBD_DIRECT;

  readonly QBDConnectionStatus = QBDConnectionStatus;

  // Helper functions
  get headerTitle(): string {
    return this.flowType === QwcRegenerationFlowType.EXISTING ?
      this.translocoService.translate('qbdDirectRegenerateQwcFile.headerTitleExistingPath') :
      this.translocoService.translate('qbdDirectRegenerateQwcFile.headerTitleNewPath');
  }

  get headerSubTitle(): string {
    return this.flowType === QwcRegenerationFlowType.EXISTING ?
      this.translocoService.translate('qbdDirectRegenerateQwcFile.headerSubTitleExistingPath') :
      this.translocoService.translate('qbdDirectRegenerateQwcFile.headerSubTitleNewPath');
  }

  get redirectLink(): string | undefined {
    if (this.flowType === QwcRegenerationFlowType.NEW) {
      return brandingKbArticles.postOnboardingArticles.QBD_DIRECT.REGENERATE_QWC_FILE_NEW_PATH_HEADER;
    }
    return undefined;
  }

  constructor(
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private qbdDirectConnectorService: QbdDirectConnectorService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private storageService: StorageService,
    private router: Router
  ) {}

  handleDownloadClick(filePath: any): void {
    if (filePath) {
      this.state.set(QwcFlowState.DOWNLOAD_IN_PROGRESS);
      this.isCompanyPathInvalid.set(false);
      this.qbdDirectConnectorService.postQbdDirectConntion({file_location: filePath}).subscribe({
        next: (connectionResponse: QbdConnectorGet) => {
          this.password.set(connectionResponse.password);
          this.xmlFileContent = connectionResponse.qwc;
          this.state.set(QwcFlowState.DOWNLOAD_DONE);
          this.handleManualDownload();
        },
        error: () => {
          this.state.set(QwcFlowState.DOWNLOAD);
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectRegenerateQwcFile.downloadError'));
        }
      });
    } else {
      this.isCompanyPathInvalid.set(true);
    }
  }

  handleManualDownload(): void {
    downloadXMLFile(this.xmlFileContent, 'sem_qbd_integration.qwc');
  }

  handleRetry(): void {
    this.state.set(QwcFlowState.DOWNLOAD);
  }

  handleDownloadNextStepClick(): void {
    this.state.set(QwcFlowState.DOWNLOAD_IN_PROGRESS);
    this.workspaceService.updateWorkspaceOnboardingState({
      onboarding_state: QbdDirectOnboardingState.PENDING_QWC_UPLOAD
    }).subscribe(() => {
      this.state.set(QwcFlowState.SETUP_CONNECTION);
    });
  }

  handleConnectionDone(event: CheckBoxUpdate): void {
    this.state.set(QwcFlowState.CONNECTION_IN_PROGRESS);
    if (event.value) {
      const user: MinimalUser = this.storageService.get('user');
      interval(3000).pipe(
        switchMap(() => this.workspaceService.getWorkspace(user.org_id) as Observable<QbdDirectWorkspace[]>), // Make HTTP request
        takeWhile(
          (workspaces) => !this.isTerminalStatus(
            workspaces[0].onboarding_state
          ),
          true
        ) // Stop if terminal status is reached
      )
      .subscribe({
        next: (workspaces) => this.handleStatus(workspaces[0].onboarding_state),
        error: (error) => {
          console.error('Error polling workspace status:', error);
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectRegenerateQwcFile.connectionError'));
        }
      });
    }
  }

  isTerminalStatus(state: QbdDirectOnboardingState): boolean {
    return [
      QbdDirectOnboardingState.INCORRECT_PASSWORD,
      QbdDirectOnboardingState.INCORRECT_COMPANY_PATH,
      QbdDirectOnboardingState.COMPANY_NAME_MISMATCH,
      QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE
    ].includes(state);
  }

  handleStatus(state: QbdDirectOnboardingState): void {
    // Once we have hit a terminal status and stopped polling,
    // 1. Show a warning dialog if the status is an error
    // 2. Update the state to the next step
    // 3. Update onboarding state as well for incorrect password

    if (state === QbdDirectOnboardingState.INCORRECT_PASSWORD) {
      this.warningDialogText.set(this.translocoService.translate('qbdDirectRegenerateQwcFile.incorrectPasswordMessage'));
      this.isDialogVisible.set(true);
      this.workspaceService.updateWorkspaceOnboardingState({
        onboarding_state: QbdDirectOnboardingState.PENDING_QWC_UPLOAD
      }).subscribe(() => {
        this.state.set(QwcFlowState.SETUP_CONNECTION);
      });
    } else if (state === QbdDirectOnboardingState.INCORRECT_COMPANY_PATH) {
      this.warningDialogText.set(this.translocoService.translate('qbdDirectRegenerateQwcFile.incorrectCompanyPathMessage'));
      this.isDialogVisible.set(true);
      this.state.set(QwcFlowState.DOWNLOAD);
      this.isCompanyPathInvalid.set(true);
    } else if (state === QbdDirectOnboardingState.COMPANY_NAME_MISMATCH) {
      this.warningDialogText.set(this.translocoService.translate('qbdDirectRegenerateQwcFile.companyNameMismatchMessage'));
      this.isDialogVisible.set(true);
      this.state.set(QwcFlowState.DOWNLOAD);
      this.isCompanyPathInvalid.set(true);
    }  else if (state === QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE) {
      this.workspaceService.updateWorkspaceOnboardingState({
        onboarding_state: QbdDirectOnboardingState.COMPLETE
      }).subscribe({
        next: () => {
          this.state.set(QwcFlowState.CONNECTION_DONE);
        },
        error: (error) => {
          console.error('Error updating workspace onboarding state:', error);
        }
      });
    }
  }

  closeDialog(): void {
    this.isDialogVisible.set(false);
  }

  handleConnectionNext(): void {
    this.router.navigate(['/integrations/qbd_direct/main/dashboard']);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.flowType = data.flowType;
    });
  }
}
