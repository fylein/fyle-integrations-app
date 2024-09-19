import { brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";
import { QBOOnboardingState } from "../../enum/enum.model";
import type { OnboardingStepper } from "../../misc/onboarding-stepper.model";

interface QBOOnboardingStepperMap {
    [QBOOnboardingState.CONNECTION]: number,
    [QBOOnboardingState.MAP_EMPLOYEES]: number,
    [QBOOnboardingState.EXPORT_SETTINGS]: number,
    [QBOOnboardingState.IMPORT_SETTINGS]: number,
    [QBOOnboardingState.ADVANCED_CONFIGURATION]: number,
    [QBOOnboardingState.COMPLETE]: number,
    [QBOOnboardingState.CLONE_SETTINGS]: number,
}

export class QBOOnboardingModel {
  brandingContent = brandingContent.configuration;

    private onboardingSteps: OnboardingStepper[] = [
        {
          active: false,
          completed: false,
          step: brandingContent.configuration.connector.stepName,
          icon: 'link-vertical-medium',
          route: '/integrations/qbo/onboarding/connector',
          styleClasses: ['step-name-connector--text']
        },
        {
            active: false,
            completed: false,
            step: brandingContent.configuration.employeeSetting.stepName,
            icon: 'mapping-medium',
            route: '/integrations/qbo/onboarding/employee_settings',
            styleClasses: ['step-name-export--text']
        },
        {
          active: false,
          completed: false,
          step: brandingContent.configuration.exportSetting.stepName,
          icon: 'arrow-tail-up-medium',
          route: '/integrations/qbo/onboarding/export_settings',
          styleClasses: ['step-name-export--text']
        },
        {
          active: false,
          completed: false,
          step: brandingContent.configuration.importSetting.stepName,
          icon: 'arrow-tail-down-medium',
          route: '/integrations/qbo/onboarding/import_settings',
          styleClasses: ['step-name-export--text']
        },
        {
          active: false,
          completed: false,
          step: brandingContent.configuration.advancedSettings.stepName,
          icon: 'gear-medium',
          route: '/integrations/qbo/onboarding/advanced_settings',
          styleClasses: ['step-name-advanced--text']
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

        if (!brandingFeatureConfig.featureFlags.mapEmployees) {
          this.onboardingSteps.splice(1, 1);
        }

        return this.onboardingSteps;
    }
}
