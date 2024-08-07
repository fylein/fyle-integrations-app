import { brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";
import { NetsuiteOnboardingState } from "../../enum/enum.model";
import { OnboardingStepper } from "../../misc/onboarding-stepper.model";


type NetsuiteOnboardingStepperMap = {
    [NetsuiteOnboardingState.CONNECTION]: number,
    [NetsuiteOnboardingState.SUBSIDIARY]: number,
    [NetsuiteOnboardingState.EXPORT_SETTINGS]: number,
    [NetsuiteOnboardingState.IMPORT_SETTINGS]: number,
    [NetsuiteOnboardingState.ADVANCED_CONFIGURATION]: number,
    [NetsuiteOnboardingState.COMPLETE]: number,
}

const brandingContentStepName = brandingContent.netsuite.configuration;

export class NetsuiteOnboardingModel {
    private onboardingSteps: OnboardingStepper[] = [
        {
          active: false,
          completed: false,
          step: brandingContentStepName.connector.stepName,
          icon: 'link-vertical-medium',
          route: '/integrations/netsuite/onboarding/connector',
          styleClasses: ['step-name-connector--text tw-pl-14-px']
        },
        {
          active: false,
          completed: false,
          step: brandingContentStepName.exportSetting.stepName,
          icon: 'arrow-tail-up-medium',
          route: '/integrations/netsuite/onboarding/export_settings',
          styleClasses: ['step-name-export--text']
        },
        {
          active: false,
          completed: false,
          step: brandingContentStepName.importSetting.stepName,
          icon: 'arrow-tail-down-medium',
          route: '/integrations/netsuite/onboarding/import_settings',
          styleClasses: ['step-name-export--text']
        },
        {
          active: false,
          completed: false,
          step: brandingContentStepName.advancedSettings.stepName,
          icon: 'gear-medium',
          route: '/integrations/netsuite/onboarding/advanced_settings',
          styleClasses: ['step-name-advanced--text']
        }
    ];

    private readonly onboardingStateStepMap: NetsuiteOnboardingStepperMap = {
        [NetsuiteOnboardingState.CONNECTION]: 1,
        [NetsuiteOnboardingState.SUBSIDIARY]: 2,
        [NetsuiteOnboardingState.EXPORT_SETTINGS]: 3,
        [NetsuiteOnboardingState.IMPORT_SETTINGS]: 4,
        [NetsuiteOnboardingState.ADVANCED_CONFIGURATION]: 5,
        [NetsuiteOnboardingState.COMPLETE]: 6
      };

    getOnboardingSteps(currentStep: string, onboardingState: NetsuiteOnboardingState): OnboardingStepper[] {
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
