import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { QBOOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOOnboardingStepperMap } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';

@Injectable({
  providedIn: 'root',
})
export class QboOnboardingService {
  private onboardingSteps: OnboardingStepper[] = [];

  private translocoService: TranslocoService = inject(TranslocoService);

  private readonly onboardingStateStepMap: QBOOnboardingStepperMap = {
    [QBOOnboardingState.CONNECTION]: 1,
    [QBOOnboardingState.EXPORT_SETTINGS]: 2,
    [QBOOnboardingState.IMPORT_SETTINGS]: 3,
    [QBOOnboardingState.ADVANCED_CONFIGURATION]: 4,
    [QBOOnboardingState.COMPLETE]: 5,
    [QBOOnboardingState.CLONE_SETTINGS]: 6,
  };

  getOnboardingSteps(currentStep: string, onboardingState: QBOOnboardingState): OnboardingStepper[] {
    this.onboardingSteps = [
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('configuration.connector.stepName'),
        icon: 'link-vertical-medium',
        route: '/integrations/qbo/onboarding/connector',
        styleClasses: ['step-name-connector--text'],
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('configuration.exportSetting.stepName'),
        icon: 'arrow-tail-up-medium',
        route: '/integrations/qbo/onboarding/export_settings',
        styleClasses: ['step-name-export--text'],
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('configuration.importSetting.stepName'),
        icon: 'arrow-tail-down-medium',
        route: '/integrations/qbo/onboarding/import_settings',
        styleClasses: ['step-name-export--text'],
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('configuration.advancedSettings.stepName'),
        icon: 'gear-medium',
        route: '/integrations/qbo/onboarding/advanced_settings',
        styleClasses: ['step-name-advanced--text'],
      },
    ];

    this.onboardingSteps.forEach((step) => {
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
