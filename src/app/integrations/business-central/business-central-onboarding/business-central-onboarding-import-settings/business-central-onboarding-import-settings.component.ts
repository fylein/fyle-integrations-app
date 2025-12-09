import { Component, OnInit } from '@angular/core';
import { BusinessCentralOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { BusinessCentralOnboardingService } from 'src/app/core/services/business-central/business-central-configuration/business-central-onboarding.service';

@Component({
  selector: 'app-business-central-onboarding-import-settings',
  templateUrl: './business-central-onboarding-import-settings.component.html',
  styleUrls: ['./business-central-onboarding-import-settings.component.scss'],
  standalone: false,
})
export class BusinessCentralOnboardingImportSettingsComponent implements OnInit {
  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps(
    BusinessCentralOnboardingState.IMPORT_SETTINGS.replace('_', ' '),
  );

  constructor(private onboardingService: BusinessCentralOnboardingService) {}

  ngOnInit(): void {}
}
