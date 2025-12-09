import { Component, OnInit } from '@angular/core';
import { TravelPerkOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { TravelperkOnboardingService } from 'src/app/core/services/travelperk/travelperk-configuration/travelperk-onboarding.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-travelperk-onboarding-payment-profile-settings',
  templateUrl: './travelperk-onboarding-payment-profile-settings.component.html',
  styleUrls: ['./travelperk-onboarding-payment-profile-settings.component.scss'],
  standalone: false,
})
export class TravelperkOnboardingPaymentProfileSettingsComponent implements OnInit {
  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps(
    new SnakeCaseToSpaceCasePipe().transform(TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS),
  );

  constructor(private onboardingService: TravelperkOnboardingService) {}

  ngOnInit(): void {}
}
