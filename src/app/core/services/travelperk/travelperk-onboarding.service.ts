import { Injectable } from '@angular/core';
import { TravelPerkOnboardingState } from '../../models/enum/enum.model';
import type { OnboardingStepper } from '../../models/misc/onboarding-stepper.model';
import type { WorkspaceService } from '../common/workspace.service';
import type { TravelPerkOnboardingStepperMap } from '../../models/travelperk/travelperk-configuration/travelperk-onboarding.model';

@Injectable({
  providedIn: 'root'
})
export class TravelperkOnboardingService {

  onboardingStateStepMap: TravelPerkOnboardingStepperMap = {
    [TravelPerkOnboardingState.CONNECTION]: 1,
    [TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS]: 2,
    [TravelPerkOnboardingState.ADVANCED_SETTINGS]: 3,
    [TravelPerkOnboardingState.COMPLETE]: 4
  };

  private readonly onboardingSteps: OnboardingStepper[] = [
    {
      active: false,
      completed: false,
      step: 'Connect to TravelPerk',
      icon: 'link-vertical-medium',
      route: '/integrations/travelperk/onboarding/landing',
      styleClasses: ['step-name-connector--text']
    },
    {
      active: false,
      completed: false,
      step: 'Payment Profile Settings',
      icon: 'arrow-tail-down-medium',
      route: '/integrations/travelperk/onboarding/payment_profile_settings',
      styleClasses: ['step-name-import--text !tw-w-100-px tw-text-pretty tw-text-center']
    },
    {
      active: false,
      completed: false,
      step: 'Advanced Settings',
      icon: 'gear-medium',
      route: '/integrations/travelperk/onboarding/advanced_settings',
      styleClasses: ['step-name-advanced--text']
    }
  ];

  private onboardingState: TravelPerkOnboardingState;

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  getOnboardingSteps(currentStep: string): OnboardingStepper[] {
    this.onboardingState = this.workspaceService.getOnboardingState();
    this.onboardingSteps.forEach(step => {
      if (step.step.toLowerCase() === currentStep.toLowerCase()) {
        step.active = true;
      } else {
        step.active = false;
      }
    });

    for (let index = this.onboardingStateStepMap[this.onboardingState] - 1; index > 0; index--) {
      this.onboardingSteps[index - 1].completed = true;
    }

    return this.onboardingSteps;
  }
}
