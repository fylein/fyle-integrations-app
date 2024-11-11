import { Component, OnInit } from '@angular/core';
import { QbdDirectSharedModule } from '../../qbd-direct-shared/qbd-direct-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { brandingConfig, brandingContent, brandingKbArticles } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { AppName, ConfigurationCta, QBDConnectionStatus, QbdDirectOnboardingState, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QbdDirectOnboardingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.model';
import { Router } from '@angular/router';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { CommonModule } from '@angular/common';
import { QbdConnectorGet, SyncDataType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { QbdDirectWorkspace } from 'src/app/core/models/qbd-direct/db/qbd-direct-workspaces.model';
import { QbdDirectConnectorService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-connector.service';
import { checkBoxEmit } from 'src/app/core/models/common/helper.model';
import { interval, switchMap, from, takeWhile } from 'rxjs';
import { QbdDirectTaskResponse } from 'src/app/core/models/qbd-direct/db/qbd-direct-task-log.model';

@Component({
  selector: 'app-qbd-direct-onboarding-connector',
  standalone: true,
  imports: [QbdDirectSharedModule, SharedModule, CommonModule],
  templateUrl: './qbd-direct-onboarding-connector.component.html',
  styleUrl: './qbd-direct-onboarding-connector.component.scss'
})
export class QbdDirectOnboardingConnectorComponent implements OnInit {

  brandingContent = brandingContent.qbd_direct.configuration.connector;

  onboardingSteps: OnboardingStepper[] = new QbdDirectOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.QBD_DIRECT.CONNECTOR;

  brandingConfig: BrandingConfiguration = brandingConfig;

  ConfigurationCtaText = ConfigurationCta;

  showDownloadLink: boolean;

  isdownloadfileLoading: boolean;

  isconnectionLoading: boolean;

  isDownloadStepCompleted: boolean;

  isConnectionStepCompleted: boolean;

  xmlFileContent: string;

  isCompanyPathInvalid: boolean = true;

  password: string;

  connectionStatus: QBDConnectionStatus;

  isConnectionCTAEnabled: boolean;

  isDialogVisible: boolean;

  qbdFields: SyncDataType[];

  isDataSyncCTADisabled: boolean;

  user:MinimalUser = this.storageService.get('user');

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private storageService: StorageService,
    private qbdDirectConntorService: QbdDirectConnectorService
  ) { }

  triggerDownload(filePath: string) {
    const normalizedPath = filePath.replace(/\\\\/g, "\\");
    const filePathRegex = /^(\/?|\.?\/?|[a-zA-Z]:\\)([a-zA-Z0-9_-]+[\\/])*[a-zA-Z0-9 _-]+\.qbw$/;
    this.isCompanyPathInvalid = filePathRegex.test(normalizedPath);
    if (this.isCompanyPathInvalid) {
      this.isdownloadfileLoading = true;
      this.qbdDirectConntorService.postQbdDirectConntion({file_location: normalizedPath}).subscribe((connectionResponse: QbdConnectorGet) => {
        this.password = connectionResponse.password;
        this.xmlFileContent = connectionResponse.qwc;
        this.triggerManualDownload();
        this.showDownloadLink = true;
      });
      this.isdownloadfileLoading = false;
    }
  }

  triggerManualDownload() {
    const blob = new Blob([this.xmlFileContent], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = 'fyle_quickbooks.qwc';
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  proceedToConnection() {
    this.isdownloadfileLoading = true;
    this.workspaceService.updateWorkspaceOnboardingState({onboarding_state: QbdDirectOnboardingState.PENDING_QWC_UPLOAD}).subscribe((workspaceResponse: QbdDirectWorkspace) => {
      this.isDownloadStepCompleted = true;
      this.isdownloadfileLoading = false;
    });
  }

  retry() {
    this.showDownloadLink = false;
  }

  onConnectionDone(event: checkBoxEmit) {
    if (event.value) {
      this.qbdDirectConntorService.syncAttribuites().subscribe((sd: SyncDataType[]) => {
        this.qbdFields = sd;
        this.isConnectionCTAEnabled = true;
        // Interval(3000).pipe(
        //   SwitchMap(() => this.workspaceService.getWorkspace(this.user.org_id)), // Make HTTP request
        //   TakeWhile((status: any) => !this.isTerminalStatus(status.onboarding_state as QbdDirectOnboardingState), true) // Stop if terminal status is reached
        // )
        // .subscribe(
        //   (status) => this.handleStatus(status),
        //   (error) => console.error('Error polling workspace status:', error)
        // );
      });
    }
  }

  handleStatus(status: QbdDirectWorkspace): void {
    const onboardingState = status.onboarding_state;

    if (onboardingState === QbdDirectOnboardingState.INCORRECT_COMPANY_PATH) {
      // Set connection status, open dialog, and stop polling
      this.connectionStatus = QBDConnectionStatus.INCORRECT_COMPANY_PATH;
      this.isDialogVisible = true;
    } else if (onboardingState === QbdDirectOnboardingState.IN_CORRECT_PASSWORD) {
      // Set connection status, open dialog, and stop polling
      this.connectionStatus = QBDConnectionStatus.IN_CORRECT_PASSWORD;
      this.isDialogVisible = true;
    } else if (onboardingState === QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS || onboardingState === QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE) {
      // Set success status, enable connection CTA, and stop polling
      this.connectionStatus = QBDConnectionStatus.SUCCESS;
      this.isConnectionCTAEnabled = true;
    }
  }

  isTerminalStatus(status: QbdDirectOnboardingState): boolean {
    return [QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS, QbdDirectOnboardingState.IN_CORRECT_PASSWORD, QbdDirectOnboardingState.INCORRECT_COMPANY_PATH, QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE].includes(status);
  }

  proceedToSyncData() {
    this.isConnectionStepCompleted = true;
    this.isDataSyncCTADisabled= true;

    // If DESTINATION_SYNC_IN_PROGRESS -> start polling workspaces/
    // Set value to qbdFields when getting API response
    // If DESTINATION_SYNC_COMPLETE => stop polling, set isDataSyncCTADisabled to false
  }


  proceedToExportSetting() {
    this.isLoading = true;
    this.workspaceService.updateWorkspaceOnboardingState({onboarding_state: QbdDirectOnboardingState.EXPORT_SETTINGS}).subscribe((workspaceResponse: QbdDirectWorkspace) => {
      this.router.navigate([`/integrations/qbd_direct/onboarding/export_settings`]);
      this.isLoading = false;
    });
  }


  setupPage() {
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaceResponse: QbdDirectWorkspace) => {
      if (workspaceResponse.onboarding_state === QbdDirectOnboardingState.PENDING_QWC_UPLOAD) {
        this.isDownloadStepCompleted = true;
        this.isdownloadfileLoading = false;
      } else if (workspaceResponse.onboarding_state === QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS) {
        this.isDownloadStepCompleted = true;
        this.isConnectionStepCompleted = true;
        this.isconnectionLoading = false;
        this.isdownloadfileLoading = false;
      }
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
