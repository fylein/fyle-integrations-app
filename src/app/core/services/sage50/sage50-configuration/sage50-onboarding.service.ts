import { OnboardingStepper } from "../../../models/misc/onboarding-stepper.model";
import { Sage50OnboardingState } from "../../../models/enum/enum.model";
import { inject, Injectable } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";

@Injectable({
  providedIn: 'root'
})
export class Sage50OnboardingService {

    private onboardingSteps: OnboardingStepper[] = [];

    private translocoService: TranslocoService = inject(TranslocoService);

    private readonly onboardingStateStepMap = {
        [Sage50OnboardingState.YET_TO_START]: 1,
        [Sage50OnboardingState.PRE_REQUISITES]: 1,
        [Sage50OnboardingState.EXPORT_SETTINGS]: 2,
        [Sage50OnboardingState.IMPORT_SETTINGS]: 3,
        [Sage50OnboardingState.ADVANCED_SETTINGS]: 4,
        [Sage50OnboardingState.COMPLETE]: 5
    };

    getOnboardingSteps(onboardingState: Sage50OnboardingState): OnboardingStepper[] {
        this.onboardingSteps = [
          {
            active: false,
            completed: false,
            step: this.translocoService.translate('services.sage50Onboarding.prerequisites'),
            icon: 'upload',
            route: '/integrations/sage50/onboarding/prerequisites',
            styleClasses: ['step-name-pre-requisite--text'],
            onboardingState: Sage50OnboardingState.PRE_REQUISITES
          },
          {
            active: false,
            completed: false,
            step: this.translocoService.translate('services.sage50Onboarding.exportSettings'),
            icon: 'arrow-tail-up-medium',
            route: '/integrations/sage50/onboarding/export_settings',
            styleClasses: ['step-name-export--text'],
            onboardingState: Sage50OnboardingState.EXPORT_SETTINGS
          },
          {
            active: false,
            completed: false,
            step: this.translocoService.translate('services.sage50Onboarding.importSettings'),
            icon: 'arrow-tail-down-medium',
            route: '/integrations/sage50/onboarding/import_settings',
            styleClasses: ['step-name-import--text'],
            onboardingState: Sage50OnboardingState.IMPORT_SETTINGS
          },
          {
            active: false,
            completed: false,
            step: this.translocoService.translate('services.sage50Onboarding.advancedSettings'),
            icon: 'gear-medium',
            route: '/integrations/sage50/onboarding/advanced_settings',
            styleClasses: ['step-name-advanced--text'],
            onboardingState: Sage50OnboardingState.ADVANCED_SETTINGS
          }
        ];

        this.onboardingSteps.forEach(step => {
          if (step.onboardingState === onboardingState) {
            step.active = true;
          }
        });

        for (let index = this.onboardingStateStepMap[onboardingState] - 1; index > 0; index--) {
          this.onboardingSteps[index - 1].completed = true;
        }

        return this.onboardingSteps;
    }
}
