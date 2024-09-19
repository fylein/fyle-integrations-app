import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { BusinessCentralOnboardingState } from 'src/app/core/models/enum/enum.model';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import type { BusinessCentralOnboardingService } from 'src/app/core/services/business-central/business-central-configuration/business-central-onboarding.service';

@Component({
  selector: 'app-business-central-onboarding-export-settings',
  templateUrl: './business-central-onboarding-export-settings.component.html',
  styleUrls: ['./business-central-onboarding-export-settings.component.scss']
})
export class BusinessCentralOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps(BusinessCentralOnboardingState.EXPORT_SETTINGS.replace('_', ' '));

  constructor(
    private onboardingService: BusinessCentralOnboardingService
  ) { }

  ngOnInit(): void {
  }

}
