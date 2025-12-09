import { Injectable } from '@angular/core';
import { OnboardingStepper } from '../../../models/misc/onboarding-stepper.model';
import { NetsuiteOnboardingState } from 'src/app/core/models/enum/enum.model';
import { NetsuiteOnboardingStepperMap } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-onboarding.model';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class NetsuiteOnboardingService {
  private onboardingSteps: OnboardingStepper[] = [];

  private readonly onboardingStateStepMap: NetsuiteOnboardingStepperMap = {
    [NetsuiteOnboardingState.CONNECTION]: 1,
    [NetsuiteOnboardingState.SUBSIDIARY]: 2,
    [NetsuiteOnboardingState.EXPORT_SETTINGS]: 3,
    [NetsuiteOnboardingState.IMPORT_SETTINGS]: 4,
    [NetsuiteOnboardingState.ADVANCED_CONFIGURATION]: 5,
    [NetsuiteOnboardingState.COMPLETE]: 6,
  };

  constructor(private translocoService: TranslocoService) {}

  getOnboardingSteps(currentStep: string, onboardingState: NetsuiteOnboardingState): OnboardingStepper[] {
    this.onboardingSteps = [
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('netsuite.configuration.connector.stepName'),
        icon: 'link-vertical-medium',
        route: '/integrations/netsuite/onboarding/connector',
        styleClasses: ['step-name-connector--text tw-pl-14-px'],
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('netsuite.configuration.exportSetting.stepName'),
        icon: 'arrow-tail-up-medium',
        route: '/integrations/netsuite/onboarding/export_settings',
        styleClasses: ['step-name-export--text'],
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('netsuite.configuration.importSetting.stepName'),
        icon: 'arrow-tail-down-medium',
        route: '/integrations/netsuite/onboarding/import_settings',
        styleClasses: ['step-name-export--text'],
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('netsuite.configuration.advancedSettings.stepName'),
        icon: 'gear-medium',
        route: '/integrations/netsuite/onboarding/advanced_settings',
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

    for (let index = this.onboardingStateStepMap[onboardingState] - 2; index > 0; index--) {
      this.onboardingSteps[index - 1].completed = true;
    }

    return this.onboardingSteps;
  }
}
