import { Component, OnInit } from '@angular/core';
import { BusinessCentralOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { BusinessCentralOnboardingService } from 'src/app/core/services/business-central/business-central-configuration/business-central-onboarding.service';

@Component({
    selector: 'app-business-central-onboarding-export-settings',
    templateUrl: './business-central-onboarding-export-settings.component.html',
    styleUrls: ['./business-central-onboarding-export-settings.component.scss'],
    standalone: false
})
export class BusinessCentralOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps(BusinessCentralOnboardingState.EXPORT_SETTINGS.replace('_', ' '));

  constructor(
    private onboardingService: BusinessCentralOnboardingService
  ) { }

  ngOnInit(): void {
  }

}
