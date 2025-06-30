import { OnboardingStepper } from "../../../models/misc/onboarding-stepper.model";
import { XeroOnboardingState } from "../../../models/enum/enum.model";
import { XeroOnboardingStepperMap } from "../../../models/xero/xero-configuration/xero-onboarding.model";
import { TranslocoService } from "@jsverse/transloco";
import { inject } from "@angular/core";

export class XeroOnboardingService {

  private onboardingSteps: OnboardingStepper[] = [];

  private translocoService: TranslocoService = inject(TranslocoService);


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
    this.onboardingSteps = [
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
        step: this.translocoService.translate('configuration.exportSetting.stepName'),
        icon: 'arrow-tail-up-medium',
        route: '/integrations/xero/onboarding/export_settings',
        styleClasses: ['step-name-export--text']
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('configuration.importSetting.stepName'),
        icon: 'arrow-tail-down-medium',
        route: '/integrations/xero/onboarding/import_settings',
        styleClasses: ['step-name-export--text']
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('configuration.advancedSettings.stepName'),
        icon: 'gear-medium',
        route: '/integrations/xero/onboarding/advanced_settings',
        styleClasses: ['step-name-advanced--text']
      }
    ];

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
