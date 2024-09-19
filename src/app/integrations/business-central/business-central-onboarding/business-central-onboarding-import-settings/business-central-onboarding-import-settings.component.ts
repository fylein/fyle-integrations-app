import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { BusinessCentralOnboardingState } from 'src/app/core/models/enum/enum.model';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import type { BusinessCentralOnboardingService } from 'src/app/core/services/business-central/business-central-configuration/business-central-onboarding.service';

@Component({
  selector: 'app-business-central-onboarding-import-settings',
  templateUrl: './business-central-onboarding-import-settings.component.html',
  styleUrls: ['./business-central-onboarding-import-settings.component.scss']
})
export class BusinessCentralOnboardingImportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps(BusinessCentralOnboardingState.IMPORT_SETTINGS.replace('_', ' '));

  constructor(
    private onboardingService: BusinessCentralOnboardingService
  ) { }

  ngOnInit(): void {
  }

}
