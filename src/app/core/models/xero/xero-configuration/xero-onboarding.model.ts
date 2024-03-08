import { brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";
import { XeroOnboardingState } from "../../enum/enum.model";
import { OnboardingStepper } from "../../misc/onboarding-stepper.model";

type XeroOnboardingStepperMap = {
    [XeroOnboardingState.CONNECTION]: number,
    [XeroOnboardingState.EXPORT_SETTINGS]: number,
    [XeroOnboardingState.IMPORT_SETTINGS]: number,
    [XeroOnboardingState.ADVANCED_CONFIGURATION]: number,
    [XeroOnboardingState.COMPLETE]: number,
    [XeroOnboardingState.CLONE_SETTINGS]: number
};

export class XeroOnboardingModel {
    brandingContent = brandingContent.configuration;

      private onboardingSteps: OnboardingStepper[] = [
          {
            active: false,
            completed: false,
            step: 'Connect to Xero',
            icon: 'link-vertical-medium',
            route: '/integrations/xero/onboarding/connector',
            styleClasses: ['step-name-connector--text']
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
          [XeroOnboardingState.EXPORT_SETTINGS]: 2,
          [XeroOnboardingState.IMPORT_SETTINGS]: 3,
          [XeroOnboardingState.ADVANCED_CONFIGURATION]: 4,
          [XeroOnboardingState.COMPLETE]: 5,
          [XeroOnboardingState.CLONE_SETTINGS]: 6
        };

      getOnboardingSteps(currentStep: string, onboardingState: XeroOnboardingState): OnboardingStepper[] {
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
