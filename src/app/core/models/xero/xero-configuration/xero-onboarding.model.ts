import { brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";
import { XeroOnboardingState } from "../../enum/enum.model";
import type { OnboardingStepper } from "../../misc/onboarding-stepper.model";

interface XeroOnboardingStepperMap {
    [XeroOnboardingState.CONNECTION]: number,
    [XeroOnboardingState.TENANT_MAPPING]: number,
    [XeroOnboardingState.EXPORT_SETTINGS]: number,
    [XeroOnboardingState.IMPORT_SETTINGS]: number,
    [XeroOnboardingState.ADVANCED_CONFIGURATION]: number,
    [XeroOnboardingState.COMPLETE]: number,
    [XeroOnboardingState.CLONE_SETTINGS]: number
}

export class XeroOnboardingModel {
    brandingContent = brandingContent.configuration;

      private onboardingSteps: OnboardingStepper[] = [
          {
            active: false,
            completed: false,
            step: 'Connect to Xero',
            icon: 'link-vertical-medium',
            route: '/integrations/xero/onboarding/connector',
            styleClasses: ['step-name-connector--text tw-pl-24-px']
          },
          {
            active: false,
            completed: false,
            step: brandingContent.configuration.exportSetting.stepName,
            icon: 'arrow-tail-up-medium',
            route: '/integrations/xero/onboarding/export_settings',
            styleClasses: ['step-name-export--text']
          },
          {
            active: false,
            completed: false,
            step: brandingContent.configuration.importSetting.stepName,
            icon: 'arrow-tail-down-medium',
            route: '/integrations/xero/onboarding/import_settings',
            styleClasses: ['step-name-export--text']
          },
          {
            active: false,
            completed: false,
            step: brandingContent.configuration.advancedSettings.stepName,
            icon: 'gear-medium',
            route: '/integrations/xero/onboarding/advanced_settings',
            styleClasses: ['step-name-advanced--text']
          }
      ];

      private readonly onboardingStateStepMap: XeroOnboardingStepperMap = {
          [XeroOnboardingState.CONNECTION]: 1,
          [XeroOnboardingState.TENANT_MAPPING]: 2,
          [XeroOnboardingState.EXPORT_SETTINGS]: 3,
          [XeroOnboardingState.IMPORT_SETTINGS]: 4,
          [XeroOnboardingState.ADVANCED_CONFIGURATION]: 5,
          [XeroOnboardingState.COMPLETE]: 6,
          [XeroOnboardingState.CLONE_SETTINGS]: 7
        };

      getOnboardingSteps(currentStep: string, onboardingState: XeroOnboardingState): OnboardingStepper[] {
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
