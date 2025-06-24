import { Injectable } from '@angular/core';
import { Sage300OnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { Sage300OnboardingStepperMap } from 'src/app/core/models/sage300/sage300-configuration/sage300-onboarding-stepper/sage300-onboarding-stepper.model';
import { WorkspaceService } from '../../common/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class Sage300OnboardingService {

  onboardingStateStepMap: Sage300OnboardingStepperMap = {
    [Sage300OnboardingState.CONNECTION]: 1,
    [Sage300OnboardingState.LOCATION_ENTITY]: 2,
    [Sage300OnboardingState.EXPORT_SETTINGS]: 3,
    [Sage300OnboardingState.IMPORT_SETTINGS]: 4,
    [Sage300OnboardingState.ADVANCED_SETTINGS]: 5,
    [Sage300OnboardingState.COMPLETE]: 6
  };

  private readonly onboardingSteps: OnboardingStepper[] = [
    {
      active: false,
      completed: false,
      step: 'Connect to Sage 300 CRE',
      icon: 'link-vertical-medium',
      route: '/integrations/sage300/onboarding/connector',
      styleClasses: ['step-name-connector--text']
    },
    {
      active: false,
      completed: false,
      step: 'Export settings',
      icon: 'arrow-tail-up-medium',
      route: '/integrations/sage300/onboarding/export_settings',
      styleClasses: ['step-name-export--text', 'step-name-export--icon']
    },
    {
      active: false,
      completed: false,
      step: 'Import settings',
      icon: 'arrow-tail-down-medium',
      route: '/integrations/sage300/onboarding/import_settings',
      styleClasses: ['step-name-import--text', 'step-name-import--icon']
    },
    {
      active: false,
      completed: false,
      step: 'Advanced settings',
      icon: 'gear-medium',
      route: '/integrations/sage300/onboarding/advanced_settings',
      styleClasses: ['step-name-advanced--text', 'step-name-advanced--icon']
    }
  ];

  private onboardingState: Sage300OnboardingState;

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
