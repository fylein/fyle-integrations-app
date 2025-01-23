import { Component, OnInit } from '@angular/core';
import { QbdDirectSharedModule } from '../../qbd-direct-shared/qbd-direct-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { brandingConfig, brandingContent, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { AppName, ConfigurationCta, Page, ProgressPhase, QBDConnectionStatus, QbdDirectOnboardingState, QbdDirectUpdateEvent, QBDOnboardingState, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
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
import { interval, switchMap, from, takeWhile } from 'rxjs';
import { QbdDirectTaskResponse } from 'src/app/core/models/qbd-direct/db/qbd-direct-task-log.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { CheckBoxUpdate } from 'src/app/core/models/common/helper.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

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

  isDownloadfileLoading: boolean;

  isConnectionLoading: boolean;

  isDataSyncLoading: boolean = true;

  isDownloadStepCompleted: boolean;

  isConnectionStepCompleted: boolean;

  xmlFileContent: string;

  isCompanyPathInvalid: boolean = false;

  password: string;

  connectionStatus: QBDConnectionStatus;

  isConnectionCTAEnabled: boolean;

  isDialogVisible: boolean;

  qbdFields: SyncDataType[];

  isDataSyncCTADisabled: boolean;

  user:MinimalUser = this.storageService.get('user');

  warningDialogText: string;

  appName: string = AppName.QBD_DIRECT;

  sessionStartTime: Date = new Date();

  workspace: QbdDirectWorkspace;

  brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private storageService: StorageService,
    private qbdDirectConnectorService: QbdDirectConnectorService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService
  ) { }

  triggerDownload(filePath: string) {
   if (filePath) {
      this.isDownloadfileLoading = true;
      this.isCompanyPathInvalid = false;
      this.qbdDirectConnectorService.postQbdDirectConntion({file_location: filePath}).subscribe((connectionResponse: QbdConnectorGet) => {
        this.password = connectionResponse.password;
        this.xmlFileContent = connectionResponse.qwc;
        this.showDownloadLink = true;
        this.isDownloadfileLoading = false;
        this.triggerManualDownload();
      });
    } else {
      this.isCompanyPathInvalid = true;
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
    this.isDownloadfileLoading = true;
    this.workspaceService.updateWorkspaceOnboardingState({onboarding_state: QbdDirectOnboardingState.PENDING_QWC_UPLOAD}).subscribe((workspaceResponse: QbdDirectWorkspace) => {
      this.workspace = workspaceResponse;
      if (this.workspaceService.getOnboardingState() === QbdDirectOnboardingState.CONNECTION) {
        this.trackingService.integrationsOnboardingCompletion(TrackingApp.QBD_DIRECT, QbdDirectOnboardingState.CONNECTION, 2);
      } else {
          const oldWorkspaceResponse = workspaceResponse;
          oldWorkspaceResponse.onboarding_state = QbdDirectOnboardingState.CONNECTION;
          this.trackingService.onUpdateEvent(
          TrackingApp.QBD_DIRECT,
          QbdDirectUpdateEvent.CONNECT_QBD_DIRECT,
          {
            phase: ProgressPhase.ONBOARDING,
            oldState: oldWorkspaceResponse,
            newState: workspaceResponse
          }
        );
      }
      this.isDownloadStepCompleted = true;
      this.isDownloadfileLoading = false;
    });
  }

  retry() {
    this.showDownloadLink = false;
  }

  onConnectionDone(event: CheckBoxUpdate) {
    this.isConnectionLoading = true;
    if (event.value) {
      interval(3000).pipe(
        switchMap(() => this.workspaceService.getWorkspace(this.user.org_id)), // Make HTTP request
        takeWhile((status: any) => !this.isTerminalStatus(status[0].onboarding_state as QbdDirectOnboardingState), true) // Stop if terminal status is reached
      )
      .subscribe(
        (status) => this.handleStatus(status[0]),
        (error) => console.error('Error polling workspace status:', error)
      );
    }
  }

  handleDataSyncState(status: QbdDirectWorkspace) {
    const onboardingState = status.onboarding_state;
    this.qbdDirectConnectorService.syncAttribuites().subscribe((qbdAttribuites: SyncDataType[]) => {
      this.qbdFields = qbdAttribuites;
      this.isDataSyncLoading = false;
      this.isDataSyncCTADisabled = onboardingState === QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE ? false : true;
    });
  }

  handleStatus(status: QbdDirectWorkspace): void {
    const onboardingState = status.onboarding_state;

    if (onboardingState === QbdDirectOnboardingState.INCORRECT_COMPANY_PATH) {
      // Set connection status, open dialog, and stop polling
      this.connectionStatus = QBDConnectionStatus.INCORRECT_COMPANY_PATH;
      this.warningDialogText = 'Incorrect company file path detected. Please check and try again.';
      this.isDialogVisible = true;
      this.isConnectionLoading = false;
    } else if (onboardingState === QbdDirectOnboardingState.INCORRECT_PASSWORD) {
      // Set connection status, open dialog, and stop polling
      this.connectionStatus = QBDConnectionStatus.IN_CORRECT_PASSWORD;
      this.warningDialogText = 'Incorrect password detected. Please check and try again.';
      this.isDialogVisible = true;
      this.isConnectionLoading = false;
    } else if (onboardingState === QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS || onboardingState === QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE) {
      // Set success status, enable connection CTA, and stop polling
      this.connectionStatus = QBDConnectionStatus.SUCCESS;
      this.isConnectionCTAEnabled = true;
      this.isConnectionLoading = false;
    }
  }

  isTerminalStatus(status: QbdDirectOnboardingState): boolean {
    return [QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS, QbdDirectOnboardingState.INCORRECT_PASSWORD, QbdDirectOnboardingState.INCORRECT_COMPANY_PATH, QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE].includes(status);
  }

  isTerminalStatusDataSync(status: QbdDirectOnboardingState): boolean {
    return [QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE].includes(status);
  }

  proceedToSyncData() {
    this.isConnectionStepCompleted = true;
    this.isDataSyncCTADisabled= true;
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaceResponse: QbdDirectWorkspace[]) => {
      if (workspaceResponse[0].onboarding_state === QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS) {
        interval(3000).pipe(
          switchMap(() => this.workspaceService.getWorkspace(this.user.org_id)), // Make HTTP request
          takeWhile((status: any) => !this.isTerminalStatusDataSync(status[0].onboarding_state as QbdDirectOnboardingState), true) // Stop if terminal status is reached
        )
        .subscribe(
          (status) => this.handleDataSyncState(status[0]),
          (error) => console.error('Error polling workspace status:', error)
        );
      } else {
        this.handleDataSyncState(workspaceResponse[0]);
      }
      if (workspaceResponse[0].onboarding_state in [QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS, QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE]) {
        this.trackingService.integrationsOnboardingCompletion(TrackingApp.QBD_DIRECT, QbdDirectOnboardingState.PENDING_QWC_UPLOAD, 2);
      } else {
          const oldWorkspaceResponse = this.workspace;
          oldWorkspaceResponse.onboarding_state = QbdDirectOnboardingState.PENDING_QWC_UPLOAD;
          this.trackingService.onUpdateEvent(
          TrackingApp.QBD_DIRECT,
          QbdDirectUpdateEvent.PENDING_QWC_UPLOAD_QBD_DIRECT,
          {
            phase: ProgressPhase.ONBOARDING,
            oldState: oldWorkspaceResponse,
            newState: workspaceResponse[0]
          }
        );
      }
    });
  }


  closeDialog(event: any) {
    if (this.connectionStatus === QBDConnectionStatus.IN_CORRECT_PASSWORD) {
      this.workspaceService.updateWorkspaceOnboardingState({onboarding_state: QbdDirectOnboardingState.PENDING_QWC_UPLOAD}).subscribe((workspaceResponse: QbdDirectWorkspace) => {
        this.isDialogVisible = false;
        this.isConnectionStepCompleted = false;
        this.isConnectionLoading = false;
      });
    } else {
      this.workspaceService.updateWorkspaceOnboardingState({onboarding_state: QbdDirectOnboardingState.CONNECTION}).subscribe((workspaceResponse: QbdDirectWorkspace) => {
        this.isDialogVisible = false;
        this.isConnectionStepCompleted = false;
        this.isDownloadStepCompleted = false;
        this.showDownloadLink = false;
        this.isCompanyPathInvalid = true;
        this.isDownloadfileLoading = false;
        this.isConnectionLoading = false;
      });
    }
  }

  proceedToExportSetting() {
    this.isLoading = true;
    this.workspaceService.updateWorkspaceOnboardingState({onboarding_state: QbdDirectOnboardingState.EXPORT_SETTINGS}).subscribe((workspaceResponse: QbdDirectWorkspace) => {
      this.trackingService.trackTimeSpent(TrackingApp.QBD_DIRECT, Page.CONNECT_QBD_DIRECT, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE) {
        this.trackingService.integrationsOnboardingCompletion(TrackingApp.QBD_DIRECT, QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE, 2);
      } else {
          const oldWorkspaceResponse = Object.assign({}, workspaceResponse) ;
          oldWorkspaceResponse.onboarding_state = QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE;
          this.trackingService.onUpdateEvent(
          TrackingApp.QBD_DIRECT,
          QbdDirectUpdateEvent.DESTINATION_SYNC_COMPLETE_QBD_DIRECT,
          {
            phase: ProgressPhase.ONBOARDING,
            oldState: oldWorkspaceResponse,
            newState: workspaceResponse
          }
        );
      }
      this.workspaceService.setOnboardingState(workspaceResponse.onboarding_state);
      this.router.navigate([`/integrations/qbd_direct/onboarding/export_settings`]);
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'QuickBooks Desktop connection successful');
    });
  }


  setupPage() {
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaceResponse: QbdDirectWorkspace[]) => {
      if (workspaceResponse[0].onboarding_state === QbdDirectOnboardingState.PENDING_QWC_UPLOAD) {
        this.qbdDirectConnectorService.getQBDConnectorSettings().subscribe((qbdConntion: QbdConnectorGet) => {
          this.xmlFileContent = qbdConntion.qwc;
          this.password = qbdConntion.password;
          this.isDownloadStepCompleted = true;
          this.isDownloadfileLoading = false;
        });
      } else if (workspaceResponse[0].onboarding_state === QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS || workspaceResponse[0].onboarding_state === QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE) {
        this.isDownloadStepCompleted = true;
        this.isConnectionStepCompleted = true;
        this.isConnectionLoading = false;
        this.isDownloadfileLoading = false;
        this.proceedToSyncData();
      }
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
