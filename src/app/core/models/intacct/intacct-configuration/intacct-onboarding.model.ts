import { brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";
import { IntacctOnboardingState } from "../../enum/enum.model";
import type { OnboardingStepper } from "../../misc/onboarding-stepper.model";

interface IntacctOnboardingStepperMap {
    [IntacctOnboardingState.CONNECTION]: number,
    [IntacctOnboardingState.LOCATION_ENTITY]: number,
    [IntacctOnboardingState.EXPORT_SETTINGS]: number,
    [IntacctOnboardingState.IMPORT_SETTINGS]: number,
    [IntacctOnboardingState.ADVANCED_CONFIGURATION]: number,
    [IntacctOnboardingState.COMPLETE]: number,
}

export class IntacctOnboardingModel {
    private onboardingSteps: OnboardingStepper[] = [
        {
          active: false,
          completed: false,
          step: brandingContent.intacct.configuration.connector.stepName,
          icon: 'link-vertical-medium',
          route: '/integrations/intacct/onboarding/connector',
          styleClasses: ['step-name-connector--text']
        },
        {
          active: false,
          completed: false,
          step: brandingContent.intacct.configuration.exportSetting.stepName,
          icon: 'arrow-tail-up-medium',
          route: '/integrations/intacct/onboarding/export_settings',
          styleClasses: ['step-name-export--text']
        },
        {
          active: false,
          completed: false,
          step: brandingContent.configuration.importSetting.stepName,
          icon: 'arrow-tail-down-medium',
          route: '/integrations/intacct/onboarding/import_settings',
          styleClasses: ['step-name-export--text']
        },
        {
          active: false,
          completed: false,
          step: brandingContent.intacct.configuration.advancedSettings.stepName,
          icon: 'gear-medium',
          route: '/integrations/intacct/onboarding/advanced_settings',
          styleClasses: ['step-name-advanced--text']
        }
    ];

    private readonly onboardingStateStepMap: IntacctOnboardingStepperMap = {
        [IntacctOnboardingState.CONNECTION]: 1,
        [IntacctOnboardingState.LOCATION_ENTITY]: 2,
        [IntacctOnboardingState.EXPORT_SETTINGS]: 3,
        [IntacctOnboardingState.IMPORT_SETTINGS]: 4,
        [IntacctOnboardingState.ADVANCED_CONFIGURATION]: 5,
        [IntacctOnboardingState.COMPLETE]: 6
      };

    getOnboardingSteps(currentStep: string, onboardingState: IntacctOnboardingState): OnboardingStepper[] {
        this.onboardingSteps.forEach(step => {
          if (step.step.toLowerCase() === currentStep.toLowerCase()) {
            step.active = true;
          } else {
            step.active = false;
          }
        });

        for (let index = this.onboardingStateStepMap[onboardingState] - 2; index > 0; index--) {
          this.onboardingSteps[index - 1].completed = true;
        }

        return this.onboardingSteps;
    }
}
