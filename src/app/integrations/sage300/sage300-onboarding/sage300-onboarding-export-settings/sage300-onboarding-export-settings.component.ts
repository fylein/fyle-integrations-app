import { Component, OnInit } from '@angular/core';
import { Sage300OnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { Sage300OnboardingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-onboarding.service';

@Component({
  selector: 'app-sage300-onboarding-export-settings',
  templateUrl: './sage300-onboarding-export-settings.component.html',
  styleUrls: ['./sage300-onboarding-export-settings.component.scss']
})
export class Sage300OnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps(Sage300OnboardingState.EXPORT_SETTINGS.replace('_', ' '));

  constructor(
    private onboardingService: Sage300OnboardingService,
  ) { }

  ngOnInit(): void {
  }

}
