import { Injectable } from '@angular/core';
import { BusinessCentralOnboardingStepperMap } from 'src/app/core/models/business-central/business-central-configuration/business-central-onboarding.model';
import { BusinessCentralOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from '../../common/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralOnboardingService {

  onboardingStateStepMap: BusinessCentralOnboardingStepperMap = {
    [BusinessCentralOnboardingState.CONNECTION]: 1,
    [BusinessCentralOnboardingState.COMPANY_SELECTION]: 1,
    [BusinessCentralOnboardingState.EXPORT_SETTINGS]: 2,
    [BusinessCentralOnboardingState.IMPORT_SETTINGS]: 3,
    [BusinessCentralOnboardingState.ADVANCED_SETTINGS]: 4,
    [BusinessCentralOnboardingState.COMPLETE]: 5
  };

  private readonly onboardingSteps: OnboardingStepper[] = [
    {
      active: false,
      completed: false,
      step: 'Connect to Dynamics \n 365 Business Central',
      icon: 'link-vertical-medium',
      route: '/integrations/business_central/onboarding/connector',
      styleClasses: ['step-name-connector--text tw-pl-12-px tw-whitespace-pre-line']
    },
    {
      active: false,
      completed: false,
      step: 'Export settings',
      icon: 'arrow-tail-up-medium',
      route: '/integrations/business_central/onboarding/export_settings',
      styleClasses: ['step-name-export--text']
    },
    {
      active: false,
      completed: false,
      step: 'Import settings',
      icon: 'arrow-tail-down-medium',
      route: '/integrations/business_central/onboarding/import_settings',
      styleClasses: ['step-name-import--text']
    },
    {
      active: false,
      completed: false,
      step: 'Advanced settings',
      icon: 'gear-medium',
      route: '/integrations/business_central/onboarding/advanced_settings',
      styleClasses: ['step-name-advanced--text']
    }
  ];

  private onboardingState: BusinessCentralOnboardingState;

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
