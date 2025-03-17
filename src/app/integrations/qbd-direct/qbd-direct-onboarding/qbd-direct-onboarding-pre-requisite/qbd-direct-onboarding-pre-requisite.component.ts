import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { brandingContent, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { brandingConfig } from 'src/app/branding/c1-content-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { CheckBoxUpdate } from 'src/app/core/models/common/helper.model';
import { AppName, ConfigurationCta, Page, ProgressPhase, QbdDirectOnboardingState, QbdDirectUpdateEvent, QBDPreRequisiteState, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QbdDirectWorkspace } from 'src/app/core/models/qbd-direct/db/qbd-direct-workspaces.model';
import { QBDPrerequisiteObject } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';
import { QbdDirectOnboardingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-onboarding-pre-requisite',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './qbd-direct-onboarding-pre-requisite.component.html',
  styleUrl: './qbd-direct-onboarding-pre-requisite.component.scss'
})
export class QbdDirectOnboardingPreRequisiteComponent {

  brandingContent = brandingContent.qbd_direct.configuration.preRequisite;

  onboardingSteps: OnboardingStepper[] = new QbdDirectOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  isLoading: boolean;

  redirectLink: string = brandingKbArticles.onboardingArticles.QBO.CONNECTOR;

  brandingConfig: BrandingConfiguration = brandingConfig;

  ConfigurationCtaText = ConfigurationCta;

  saveInProgress: boolean = false;

  isContinueDisabled: boolean = true;

  appName = AppName.QBD_DIRECT;

  preRequisitesteps: QBDPrerequisiteObject[] = [
    {
      id: 1,
      label: 'Install QuickBooks Web Connector',
      caption: `<a href='https://developer.intuit.com/app/developer/qbdesktop/docs/get-started/get-started-with-quickbooks-web-connector' target="_blank" class=" tw-underline !tw-underline-offset-1" >Download</a> and install the QuickBooks Web Connector on the system where QuickBooks Desktop is installed.`,
      externalLink: 'https://qbd.com',
      iconName: 'download-medium',
      state: QBDPreRequisiteState.INCOMPLETE
    },
    {
      id: 2,
      label: 'Keep your Quickbooks company file open',
      caption: 'Make sure the QuickBooks Company you want to connect to ' + brandingConfig.brandName + ' is open during the integration setup.',
      externalLink: 'https://qbd.com',
      iconName: 'expand',
      state: QBDPreRequisiteState.INCOMPLETE
    }
  ];

  qbdPreRequisiteState = QBDPreRequisiteState;

  sessionStartTime: Date = new Date();

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private trackingService: TrackingService
  ) { }

  updateConnectorStatus(status: CheckBoxUpdate): void {
    this.preRequisitesteps[status.id-1].state = status.value ? QBDPreRequisiteState.COMPLETE : QBDPreRequisiteState.INCOMPLETE;
    if (this.preRequisitesteps[0].state === QBDPreRequisiteState.COMPLETE && this.preRequisitesteps[1].state === QBDPreRequisiteState.COMPLETE) {
      this.isContinueDisabled = false;
    }
  }

  continueToNextStep(): void{
    this.saveInProgress = true;
    this.workspaceService.updateWorkspaceOnboardingState({onboarding_state: QbdDirectOnboardingState.CONNECTION}).subscribe((workspaceResponse: QbdDirectWorkspace) => {
      this.trackingService.trackTimeSpent(TrackingApp.QBD_DIRECT, Page.CONFIRM_PRE_REQUISITES_QBD_DIRECT, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES) {
        this.trackingService.integrationsOnboardingCompletion(TrackingApp.QBD_DIRECT, QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES, 1);
      } else {
        const oldWorkspaceResponse = workspaceResponse;
        oldWorkspaceResponse.onboarding_state = QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES;
        this.trackingService.onUpdateEvent(
          TrackingApp.QBD_DIRECT,
          QbdDirectUpdateEvent.CONFIRM_PRE_REQUISITES_QBD_DIRECT,
          {
            phase: ProgressPhase.ONBOARDING,
            oldState: oldWorkspaceResponse,
            newState: workspaceResponse
          }
        );
      }
      this.workspaceService.setOnboardingState(workspaceResponse.onboarding_state);
      this.saveInProgress = false;
      this.router.navigate([`/integrations/qbd_direct/onboarding/connector`]);
    });
  }

}
