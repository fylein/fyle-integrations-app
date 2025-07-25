import { Component, OnInit } from '@angular/core';
import { TravelPerkOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { TravelperkOnboardingService } from 'src/app/core/services/travelperk/travelperk-onboarding.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
    selector: 'app-travelperk-onboarding-advanced-settings',
    templateUrl: './travelperk-onboarding-advanced-settings.component.html',
    styleUrls: ['./travelperk-onboarding-advanced-settings.component.scss'],
    standalone: false
})
export class TravelperkOnboardingAdvancedSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps(new SnakeCaseToSpaceCasePipe().transform(TravelPerkOnboardingState.ADVANCED_SETTINGS));

  constructor(
    private onboardingService: TravelperkOnboardingService
  ) { }

  ngOnInit(): void {
  }

}
