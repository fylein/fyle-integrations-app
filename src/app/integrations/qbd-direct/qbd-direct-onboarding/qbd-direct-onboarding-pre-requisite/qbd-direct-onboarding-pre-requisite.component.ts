import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { brandingContent, brandingKbArticles } from 'src/app/branding/branding-config';
import { brandingConfig } from 'src/app/branding/c1-contents-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { checkBoxEmit } from 'src/app/core/models/common/helper.model';
import { ConfigurationCta, QBDPreRequisiteState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBDPrerequisiteObject } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';
import { QbdDirectOnboardingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
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

  preRequisitesteps: QBDPrerequisiteObject[] = [
    {
      id: 1,
      label: 'Install QuickBooks Web Connector',
      caption: 'Download and install the QuickBooks Web Connector on the system where QuickBooks Desktop is installed.',
      externalLink: 'https://qbd.com',
      iconName: 'downloadqbd',
      state: QBDPreRequisiteState.COMPLETE // INCOMPLETE
    },
    {
      id: 2,
      label: 'Keep your Quickbooks company file open',
      caption: 'Make sure the QuickBooks Company you want to connect to Fyle is open during the integration setup.',
      externalLink: 'https://qbd.com',
      iconName: 'expand',
      state: QBDPreRequisiteState.INCOMPLETE // INCOMPLETE
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private storageService: StorageService
  ) { }

  qbdWebConnectorStatus(status: checkBoxEmit): void {
  }

  continueToNextStep(): void{
  }

}
