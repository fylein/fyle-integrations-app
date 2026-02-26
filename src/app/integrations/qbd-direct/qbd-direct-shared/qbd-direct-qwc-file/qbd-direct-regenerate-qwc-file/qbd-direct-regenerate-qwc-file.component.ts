import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QwcFlowState, QwcRegenerationFlowType, QwcRouteState } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-qwc-file.model';
import { QbdDirectPrerequisitesV2Component } from '../../qbd-direct-prerequisites-v2/qbd-direct-prerequisites-v2.component';
import { TranslocoService } from '@jsverse/transloco';
import { brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppName, ConfigurationCta, QBDConnectionStatus, QbdDirectOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QbdDirectDownloadFileComponent } from "../../qbd-direct-download-file/qbd-direct-download-file.component";
import { QbdDirectSetupConnectionComponent } from '../../qbd-direct-setup-connection/qbd-direct-setup-connection.component';
import { QbdDirectConnectorService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-connector.service';
import { downloadXMLFile } from 'src/app/core/util/downloadFile';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { CheckBoxUpdate } from 'src/app/core/models/common/helper.model';
import { catchError, interval, map, Observable, of, switchMap, takeWhile, tap } from 'rxjs';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { QbdDirectWorkspace } from 'src/app/core/models/qbd-direct/db/qbd-direct-workspaces.model';
import { QbdDirectQwcLastVisitedFlowService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-qwc-last-visited-flow.service';

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

  readonly ConfigurationCta = ConfigurationCta;

  readonly QwcRegenerationFlowType = QwcRegenerationFlowType;

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

  get headerArticleLink(): string | undefined {
    if (this.flowType === QwcRegenerationFlowType.NEW) {
      return brandingKbArticles.postOnboardingArticles.QBD_DIRECT.REGENERATE_QWC_FILE_NEW_PATH_HEADER;
    }
    return undefined;
  }

  get warningText(): string {
    if (this.flowType === QwcRegenerationFlowType.NEW) {
      return this.translocoService.translate('qbdDirectRegenerateQwcFile.warningTextNewPath');
    }
    return this.translocoService.translate('qbdDirectRegenerateQwcFile.warningTextExistingPath');
  }

  get warningArticleLink(): string {
    if (this.flowType === QwcRegenerationFlowType.NEW) {
      return brandingKbArticles.postOnboardingArticles.QBD_DIRECT.REGENERATE_QWC_FILE_NEW_PATH_WARNING;
    }
    return brandingKbArticles.postOnboardingArticles.QBD_DIRECT.REGENERATE_QWC_FILE_EXISTING_PATH_WARNING;
  }

  constructor(
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private qbdDirectConnectorService: QbdDirectConnectorService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private storageService: StorageService,
    private router: Router,
    private qbdDirectQwcLastVisitedFlowService: QbdDirectQwcLastVisitedFlowService
  ) {}

  handlePrerequisitesContinue(): void {
    if (this.flowType === QwcRegenerationFlowType.NEW) {
      this.state.set(QwcFlowState.DOWNLOAD);
      return;
    }

    // For existing flow
    // 1. update the workspace onboarding state to PENDING_QWC_UPLOAD and
    // 2. download the qwc file
    // 3. store last visited flow in localstorage
    this.isLoading = true;
    this.workspaceService.updateWorkspaceOnboardingState({
      onboarding_state: QbdDirectOnboardingState.PENDING_QWC_UPLOAD
    }).subscribe({
      next: () => {
        this.state.set(QwcFlowState.SETUP_CONNECTION);
        this.handleManualDownload();
        this.isLoading = false;
        this.qbdDirectQwcLastVisitedFlowService.set(this.flowType);
      },
      error: (error) => {
        console.error('Error updating workspace onboarding state:', error);
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectRegenerateQwcFile.somethingWentWrong'));
        this.isLoading = false;
      }
    });
  }

  handleDownloadClick(filePath: any): void {
    if (filePath) {
      this.state.set(QwcFlowState.DOWNLOAD_IN_PROGRESS);
      this.isCompanyPathInvalid.set(false);
      this.qbdDirectConnectorService.postQbdConnectorSettings({file_location: filePath}).subscribe({
        next: (qbdConnectorSettings) => {
          this.password.set(qbdConnectorSettings.password);
          this.xmlFileContent = qbdConnectorSettings.qwc;
          this.state.set(QwcFlowState.DOWNLOAD_DONE);
          this.handleManualDownload();
          this.qbdDirectQwcLastVisitedFlowService.set(this.flowType);
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

  handleBackClick(): void {
    if (this.state() > QwcFlowState.SETUP_CONNECTION) {
      this.workspaceService.updateWorkspaceOnboardingState({
        onboarding_state: QbdDirectOnboardingState.PENDING_QWC_UPLOAD
      }).subscribe({
        next: () => {
          this.state.set(QwcFlowState.SETUP_CONNECTION);
        },
        error: (error) => {
          console.error('Error updating workspace onboarding state:', error);
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectRegenerateQwcFile.somethingWentWrong'));
        }
      });
    } else if (this.state() > QwcFlowState.DOWNLOAD && this.flowType === QwcRegenerationFlowType.NEW) {
      this.state.set(QwcFlowState.DOWNLOAD);
    } else {
      this.state.set(QwcFlowState.PREREQUISITES);
    }
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
      this.performPolling();
    }
  }

  private performPolling(): void {
    const user: MinimalUser = this.storageService.get('user');
    interval(3000).pipe(
      switchMap(() => this.workspaceService.getWorkspace(user.org_id) as Observable<QbdDirectWorkspace[]>), // Make HTTP request
      takeWhile(
        (workspaces) => !this.isTerminalStatus(
          workspaces[0].onboarding_state
        ),
        true
      ),
      switchMap((workspaces) => this.handleStatus(workspaces[0].onboarding_state))
    )
    .subscribe({
      error: (error) => {
        console.error('Error polling workspace status:', error);
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectRegenerateQwcFile.connectionError'));
      }
    });
  }

  isTerminalStatus(state: QbdDirectOnboardingState): boolean {
    return [
      QbdDirectOnboardingState.INCORRECT_PASSWORD,
      QbdDirectOnboardingState.INCORRECT_COMPANY_PATH,
      QbdDirectOnboardingState.COMPANY_NAME_MISMATCH,
      QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE
    ].includes(state);
  }

  handleStatus(state: QbdDirectOnboardingState): Observable<null> {
    // Once we have hit a terminal status and stopped polling,
    // 1. Show a warning dialog if the status is an error
    // 2. Update the state to the next step
    // 3. Update onboarding state as well for incorrect password

    if (state === QbdDirectOnboardingState.INCORRECT_PASSWORD) {
      this.warningDialogText.set(this.translocoService.translate('qbdDirectRegenerateQwcFile.incorrectPasswordMessage'));
      this.isDialogVisible.set(true);
      return this.workspaceService.updateWorkspaceOnboardingState({
        onboarding_state: QbdDirectOnboardingState.PENDING_QWC_UPLOAD
      }).pipe(
        tap(() => this.state.set(QwcFlowState.SETUP_CONNECTION)),
        map(() => null)
      );
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
    } else if (state === QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE) {
      return this.workspaceService.updateWorkspaceOnboardingState({
        onboarding_state: QbdDirectOnboardingState.COMPLETE
      }).pipe(
        tap(() => this.state.set(QwcFlowState.CONNECTION_DONE)),
        catchError((error) => {
          console.error('Error updating workspace onboarding state:', error);
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectRegenerateQwcFile.somethingWentWrong'));
          return of(null);
        }),
        map(() => null)
      );
    }

    return of(null);
  }

  closeDialog(): void {
    this.isDialogVisible.set(false);
  }

  handleConnectionNext(): void {
    this.router.navigate(['/integrations/qbd_direct/main/dashboard']);
  }

  private navigate(onboardingState: QbdDirectOnboardingState): Observable<null> {
    // Handle non-terminal states
    if (onboardingState === QbdDirectOnboardingState.PENDING_QWC_UPLOAD) {
      this.state.set(QwcFlowState.SETUP_CONNECTION);
    } else if (onboardingState === QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS) {
      this.state.set(QwcFlowState.CONNECTION_IN_PROGRESS);
      this.performPolling();
    } else {
      // We must be in a terminal state
      return this.handleStatus(onboardingState);
    }

    return of(null);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.flowType = data.flowType;
      if (this.flowType === QwcRegenerationFlowType.EXISTING) {
        this.qbdDirectConnectorService.getQBDConnectorSettings().subscribe((qbdConnectorSettings) => {
          this.password.set(qbdConnectorSettings.password);
          this.xmlFileContent = qbdConnectorSettings.qwc;
          this.isLoading = false;
        });
      }
    });

    const { goToPrerequisites } = history.state as QwcRouteState;
    if (goToPrerequisites) {
      this.state.set(QwcFlowState.PREREQUISITES);
      return;
    }

    // If goToPrerequisites is not set, we are not coming from the landing page
    // We must then be resuming a previous flow (redirected from qbd-direct.component.ts)
    // In this case, get the onboarding state and go to the last visited step
    this.isLoading = true;
    const user: MinimalUser = this.storageService.get('user');
    this.workspaceService.getWorkspace(user.org_id).subscribe((workspaces: QbdDirectWorkspace[]) => {
      this.navigate(workspaces[0].onboarding_state).subscribe(() => {
        this.isLoading = false;
      });
    });
  }
}
