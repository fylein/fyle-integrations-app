import { IntacctOnboardingState } from "../../../models/enum/enum.model";
import { OnboardingStepper } from "../../../models/misc/onboarding-stepper.model";
import { Injectable } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";
import { IntacctOnboardingStepperMap } from "../../../models/intacct/intacct-configuration/intacct-onboarding.model";

@Injectable({
  providedIn: 'root'
})
export class IntacctOnboardingService {
  private onboardingSteps: OnboardingStepper[] = [];

  private readonly onboardingStateStepMap: IntacctOnboardingStepperMap = {
      [IntacctOnboardingState.CONNECTION]: 1,
      [IntacctOnboardingState.LOCATION_ENTITY]: 2,
      [IntacctOnboardingState.EXPORT_SETTINGS]: 3,
      [IntacctOnboardingState.IMPORT_SETTINGS]: 4,
      [IntacctOnboardingState.ADVANCED_CONFIGURATION]: 5,
      [IntacctOnboardingState.COMPLETE]: 6
  };

  constructor(private translocoService: TranslocoService) {}

  getOnboardingSteps(currentStep: string, onboardingState: IntacctOnboardingState): OnboardingStepper[] {
    this.onboardingSteps = [
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('intacct.configuration.connector.stepName'),
        icon: 'link-vertical-medium',
        route: '/integrations/intacct/onboarding/connector',
        styleClasses: ['step-name-connector--text']
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('intacct.configuration.exportSetting.stepName'),
        icon: 'arrow-tail-up-medium',
        route: '/integrations/intacct/onboarding/export_settings',
        styleClasses: ['step-name-export--text']
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('configuration.importSetting.stepName'),
        icon: 'arrow-tail-down-medium',
        route: '/integrations/intacct/onboarding/import_settings',
        styleClasses: ['step-name-export--text']
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('intacct.configuration.advancedSettings.stepName'),
        icon: 'gear-medium',
        route: '/integrations/intacct/onboarding/advanced_settings',
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