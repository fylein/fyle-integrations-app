import { Injectable } from '@angular/core';
import { IntacctOnboardingState, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';

@Injectable({
  providedIn: 'root'
})
export class Sage300OnboardingService {

  onboardingStateStepMap: any = {
    [IntacctOnboardingState.CONNECTION]: 1,
    [IntacctOnboardingState.LOCATION_ENTITY]: 2,
    [IntacctOnboardingState.EXPORT_SETTINGS]: 3,
    [IntacctOnboardingState.IMPORT_SETTINGS]: 4,
    [IntacctOnboardingState.ADVANCED_CONFIGURATION]: 5,
    [IntacctOnboardingState.COMPLETE]: 6
  };

  onboardingSteps: OnboardingStepper[] = [
    {
      active: false,
      completed: false,
      number: 1,
      step: 'Connect to Sage Intacct',
      icon: 'connector',
      route: '/integrations/qbd/onboarding/connector',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 2,
      step: 'Export Settings',
      icon: 'export-setting',
      route: '/integrations/qbd/onboarding/export_settings',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 3,
      step: 'Import Settings',
      icon: 'import-setting',
      route: '/integrations/qbd/onboarding/import_settings',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 4,
      step: 'Advanced Settings',
      icon: 'advanced-setting',
      route: '/integrations/qbd/onboarding/advanced_settings',
      size: {
        height: '20px',
        width: '20px'
      }
    }
  ];

  constructor() { }

  updateActiveAndCompletedSteps(currentStep: string, onboardingState: IntacctOnboardingState): OnboardingStepper[] {
    this.onboardingSteps.forEach(step => {
      if (step.route === currentStep) {
        step.active = true;
      }
    });

    for (let index = this.onboardingStateStepMap[onboardingState] - 1; index > 0; index--) {
      this.onboardingSteps[index - 1].completed = true;
    }

    return this.onboardingSteps;
  }
}
