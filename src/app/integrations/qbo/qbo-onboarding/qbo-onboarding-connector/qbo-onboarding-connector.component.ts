import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOOnboaringClass } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-qbo-onboarding-connector',
  templateUrl: './qbo-onboarding-connector.component.html',
  styleUrls: ['./qbo-onboarding-connector.component.scss']
})
export class QboOnboardingConnectorComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new QBOOnboaringClass().getOnboardingSteps('Connect to QuickBooks Online', this.workspaceService.getOnboardingState());

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.QBO.CONNECTOR;

  brandingConfig: BrandingConfiguration = brandingConfig;

  ConfigurationCtaText = ConfigurationCta;

  saveInProgress: boolean = false;

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  save(): void {
    // TODO
  }

  private setupPage(): void {
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
