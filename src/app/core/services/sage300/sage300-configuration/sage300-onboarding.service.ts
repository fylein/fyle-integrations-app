import { Injectable } from '@angular/core';
import { Sage300OnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { Sage300OnboardingStepperMap } from 'src/app/core/models/sage300/sage300-configuration/sage300-onboarding-stepper/sage300-onboarding-stepper.model';

@Injectable({
  providedIn: 'root'
})
export class Sage300OnboardingService {

  onboardingStateStepMap: Sage300OnboardingStepperMap = {
    [Sage300OnboardingState.CONNECTION]: 1,
    [Sage300OnboardingState.EXPORT_SETTINGS]: 2,
    [Sage300OnboardingState.IMPORT_SETTINGS]: 3,
    [Sage300OnboardingState.ADVANCED_CONFIGURATION]: 4,
    [Sage300OnboardingState.COMPLETE]: 5
  };

  private readonly onboardingSteps: OnboardingStepper[] = [
    {
      active: false,
      completed: false,
      number: 1,
      step: 'Connect to Sage 300 CRE',
      icon: 'connector',
      route: '/integrations/sage300/onboarding/connector',
      size: {
        height: '18px',
        width: '15px'
      },
      styleClasses: ['step-name-connector--text', 'step-name-connector--icon']
    },
    {
      active: false,
      completed: false,
      number: 2,
      step: 'Export Settings',
      icon: 'export-setting',
      route: '/integrations/sage300/onboarding/export_settings',
      size: {
        height: '18px',
        width: '15px'
      },
      styleClasses: ['step-name-export--text', 'step-name-export--icon']
    },
    {
      active: false,
      completed: false,
      number: 3,
      step: 'Import Settings',
      icon: 'import-setting',
      route: '/integrations/sage300/onboarding/import_settings',
      size: {
        height: '18px',
        width: '15px'
      },
      styleClasses: ['step-name-import--text', 'step-name-import--icon']
    },
    {
      active: false,
      completed: false,
      number: 4,
      step: 'Advanced Settings',
      icon: 'advanced-setting',
      route: '/integrations/sage300/onboarding/advanced_settings',
      size: {
        height: '20px',
        width: '20px'
      },
      styleClasses: ['step-name-advanced--text', 'step-name-advanced--icon']
    }
  ];

  constructor() { }

  getOnboardingSteps(currentStep: string, onboardingState: Sage300OnboardingState): OnboardingStepper[] {
    this.onboardingSteps.forEach(step => {
      if (step.step.toLowerCase() === currentStep.toLowerCase()) {
        step.active = true;
      }
    });

    for (let index = this.onboardingStateStepMap[onboardingState]-1; index > 0; index--) {
      this.onboardingSteps[index - 1].completed = true;
    }

    return this.onboardingSteps;
  }
}
