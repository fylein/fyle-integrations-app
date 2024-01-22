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
      icon: 'connector',
      route: '/integrations/business_central/onboarding/connector',
      size: {
        height: '18px',
        width: '15px'
      },
      styleClasses: ['step-name-connector--text tw-pl-12-px tw-whitespace-pre-line', 'step-name-connector--icon']
    },
    {
      active: false,
      completed: false,
      step: 'Export Settings',
      icon: 'export-setting',
      route: '/integrations/business_central/onboarding/export_settings',
      size: {
        height: '18px',
        width: '15px'
      },
      styleClasses: ['step-name-export--text', 'step-name-export--icon']
    },
    {
      active: false,
      completed: false,
      step: 'Import Settings',
      icon: 'import-setting',
      route: '/integrations/business_central/onboarding/import_settings',
      size: {
        height: '18px',
        width: '15px'
      },
      styleClasses: ['step-name-import--text', 'step-name-import--icon']
    },
    {
      active: false,
      completed: false,
      step: 'Advanced Settings',
      icon: 'advanced-setting',
      route: '/integrations/business_central/onboarding/advanced_settings',
      size: {
        height: '20px',
        width: '20px'
      },
      styleClasses: ['step-name-advanced--text', 'step-name-advanced--icon']
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
