import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { BusinessCentralOnboardingService } from 'src/app/core/services/business-central/business-central-configuration/business-central-onboarding.service';

@Component({
  selector: 'app-business-central-onboarding-connector',
  templateUrl: './business-central-onboarding-connector.component.html',
  styleUrls: ['./business-central-onboarding-connector.component.scss']
})
export class BusinessCentralOnboardingConnectorComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink = brandingKbArticles.topLevelArticles.BUSINESS_CENTRAL;

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps('Connect to Dynamics \n 365 Business Central');

  connectBusinessCentralForm: FormGroup;

  brandingConfig: BrandingConfiguration = brandingConfig;

  ConfigurationCtaText = ConfigurationCta;

  saveInProgress: boolean = false;

  constructor(
    private onboardingService: BusinessCentralOnboardingService
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
