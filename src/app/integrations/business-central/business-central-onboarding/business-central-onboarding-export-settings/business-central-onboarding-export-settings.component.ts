import { Component, OnInit } from '@angular/core';
import { BusinessCentralOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { BusinessCentralOnboardingService } from 'src/app/core/services/business-central/business-central-configuration/business-central-onboarding.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-business-central-onboarding-export-settings',
  templateUrl: './business-central-onboarding-export-settings.component.html',
  styleUrls: ['./business-central-onboarding-export-settings.component.scss']
})
export class BusinessCentralOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[];

  constructor(
    private onboardingService: BusinessCentralOnboardingService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.onboardingService.getOnboardingSteps(this.translocoService.translate('businessCentralOnboardingExportSettings.stepName'));
  }

}
