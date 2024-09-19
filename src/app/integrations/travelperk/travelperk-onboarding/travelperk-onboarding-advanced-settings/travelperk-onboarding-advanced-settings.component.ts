import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { TravelPerkOnboardingState } from 'src/app/core/models/enum/enum.model';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import type { TravelperkOnboardingService } from 'src/app/core/services/travelperk/travelperk-onboarding.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-travelperk-onboarding-advanced-settings',
  templateUrl: './travelperk-onboarding-advanced-settings.component.html',
  styleUrls: ['./travelperk-onboarding-advanced-settings.component.scss']
})
export class TravelperkOnboardingAdvancedSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps(new SnakeCaseToSpaceCasePipe().transform(TravelPerkOnboardingState.ADVANCED_SETTINGS));

  constructor(
    private onboardingService: TravelperkOnboardingService
  ) { }

  ngOnInit(): void {
  }

}
