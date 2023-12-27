import { QBOOnboardingState } from "../../enum/enum.model";
import { OnboardingStepper } from "../../misc/onboarding-stepper.model";

type QBOOnboardingStepperMap = {
    [QBOOnboardingState.CONNECTION]: number,
    [QBOOnboardingState.MAP_EMPLOYEES]: number,
    [QBOOnboardingState.EXPORT_SETTINGS]: number,
    [QBOOnboardingState.IMPORT_SETTINGS]: number,
    [QBOOnboardingState.ADVANCED_CONFIGURATION]: number,
    [QBOOnboardingState.COMPLETE]: number,
    [QBOOnboardingState.CLONE_SETTINGS]: number,
}

export class QBOOnboardingModel {
    private readonly onboardingSteps: OnboardingStepper[] = [
        {
          active: false,
          completed: false,
          number: 1,
          step: 'Connect to QuickBooks Online',
          icon: 'connector',
          route: '/integrations/qbo/onboarding/connector',
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
            step: 'Map Employees',
            icon: 'export-setting',
            route: '/integrations/qbo/onboarding/employee_settings',
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
          step: 'Export Settings',
          icon: 'export-setting',
          route: '/integrations/qbo/onboarding/export_settings',
          size: {
            height: '18px',
            width: '15px'
          },
          styleClasses: ['step-name-export--text', 'step-name-export--icon']
        },
        {
          active: false,
          completed: false,
          number: 4,
          step: 'Import Settings',
          icon: 'export-setting',
          route: '/integrations/qbo/onboarding/import_settings',
          size: {
            height: '18px',
            width: '15px'
          },
          styleClasses: ['step-name-export--text', 'step-name-export--icon']
        },
        {
          active: false,
          completed: false,
          number: 5,
          step: 'Advanced Settings',
          icon: 'advanced-setting',
          route: '/integrations/qbo/onboarding/advanced_settings',
          size: {
            height: '20px',
            width: '20px'
          },
          styleClasses: ['step-name-advanced--text', 'step-name-advanced--icon']
        }
    ];

    private readonly onboardingStateStepMap: QBOOnboardingStepperMap = {
        [QBOOnboardingState.CONNECTION]: 1,
        [QBOOnboardingState.MAP_EMPLOYEES]: 2,
        [QBOOnboardingState.EXPORT_SETTINGS]: 3,
        [QBOOnboardingState.IMPORT_SETTINGS]: 4,
        [QBOOnboardingState.ADVANCED_CONFIGURATION]: 5,
        [QBOOnboardingState.COMPLETE]: 6,
        [QBOOnboardingState.CLONE_SETTINGS]: 7
      };

    getOnboardingSteps(currentStep: string, onboardingState: QBOOnboardingState): OnboardingStepper[] {
        this.onboardingSteps.forEach(step => {
          if (step.step.toLowerCase() === currentStep.toLowerCase()) {
            step.active = true;
          } else {
            step.active = false;
          }
        });

        for (let index = this.onboardingStateStepMap[onboardingState] - 1; index > 0; index--) {
          this.onboardingSteps[index - 1].completed = true;
        }

        return this.onboardingSteps;
    }
}
