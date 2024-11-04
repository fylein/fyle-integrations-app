import { brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";
import { QbdDirectOnboardingState } from "../../enum/enum.model";
import { OnboardingStepper } from "../../misc/onboarding-stepper.model";

type QbdOnboardingStepperMap = {
    [QbdDirectOnboardingState.YET_TO_START]: number;
    [QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES]: number;
    [QbdDirectOnboardingState.CONNECTION]: number;
    [QbdDirectOnboardingState.PENDING_QWC_UPLOAD]: number;
    [QbdDirectOnboardingState.INCORRECT_COMPANY_PATH]: number;
    [QbdDirectOnboardingState.IN_CORRECT_PASSWORD]: number;
    [QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS]: number;
    [QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE]: number;
    [QbdDirectOnboardingState.EXPORT_SETTINGS]: number;
    [QbdDirectOnboardingState.IMPORT_SETTINGS]: number;
    [QbdDirectOnboardingState.ADVANCED_SETTINGS]: number;
    [QbdDirectOnboardingState.COMPLETE]: number;
}

export class QbdDirectOnboardingModel {
  brandingContent = brandingContent.qbd_direct.configuration;

    private onboardingSteps: OnboardingStepper[] = [
        {
            active: false,
            completed: false,
            step: this.brandingContent.preRequisite.stepName,
            icon: 'arrow-tail-up-medium',
            route: '/integrations/qbo/onboarding/pre_requisite',
            styleClasses: ['step-name-connector--text']
        },
        {
          active: false,
          completed: false,
          step: this.brandingContent.connector.stepName,
          icon: 'link-vertical-medium',
          route: '/integrations/qbo/onboarding/connector',
          styleClasses: ['step-name-connector--text']
        },
        {
          active: false,
          completed: false,
          step: this.brandingContent.exportSetting.stepName,
          icon: 'arrow-tail-up-medium',
          route: '/integrations/qbo/onboarding/export_settings',
          styleClasses: ['step-name-export--text']
        },
        {
          active: false,
          completed: false,
          step: this.brandingContent.importSetting.stepName,
          icon: 'arrow-tail-down-medium',
          route: '/integrations/qbo/onboarding/import_settings',
          styleClasses: ['step-name-export--text']
        },
        {
          active: false,
          completed: false,
          step: this.brandingContent.advancedSettings.stepName,
          icon: 'gear-medium',
          route: '/integrations/qbo/onboarding/advanced_settings',
          styleClasses: ['step-name-advanced--text']
        }
    ];

    private readonly onboardingStateStepMap: QbdOnboardingStepperMap = {
        [QbdDirectOnboardingState.YET_TO_START]: 1,
        [QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES]: 1,
        [QbdDirectOnboardingState.CONNECTION]: 2,
        [QbdDirectOnboardingState.PENDING_QWC_UPLOAD]: 2,
        [QbdDirectOnboardingState.INCORRECT_COMPANY_PATH]: 2,
        [QbdDirectOnboardingState.IN_CORRECT_PASSWORD]: 2,
        [QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS]: 2,
        [QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE]: 2,
        [QbdDirectOnboardingState.EXPORT_SETTINGS]: 3,
        [QbdDirectOnboardingState.IMPORT_SETTINGS]: 4,
        [QbdDirectOnboardingState.ADVANCED_SETTINGS]: 5,
        [QbdDirectOnboardingState.COMPLETE]: 6
    };

    getOnboardingSteps(currentStep: string, onboardingState: QbdDirectOnboardingState): OnboardingStepper[] {
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
