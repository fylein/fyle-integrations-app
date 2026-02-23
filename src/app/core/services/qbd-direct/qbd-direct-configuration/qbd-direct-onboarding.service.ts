import { OnboardingStepper } from "../../../models/misc/onboarding-stepper.model";
import { QbdDirectOnboardingState } from "../../../models/enum/enum.model";
import { inject, Injectable } from "@angular/core";
import { QbdOnboardingStepperMap } from "../../../models/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.model";
import { TranslocoService } from "@jsverse/transloco";

@Injectable({
  providedIn: 'root'
})
export class QbdDirectOnboardingService {

    private onboardingSteps: OnboardingStepper[] = [];

    private translocoService: TranslocoService = inject(TranslocoService);

    private readonly onboardingStateStepMap: QbdOnboardingStepperMap = {
        [QbdDirectOnboardingState.YET_TO_START]: 1,
        [QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES]: 1,
        [QbdDirectOnboardingState.CONNECTION]: 2,
        [QbdDirectOnboardingState.PENDING_QWC_UPLOAD]: 2,
        [QbdDirectOnboardingState.INCORRECT_COMPANY_PATH]: 2,
        [QbdDirectOnboardingState.INCORRECT_PASSWORD]: 2,
        [QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS]: 2,
        [QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE]: 2,
        [QbdDirectOnboardingState.COMPANY_NAME_MISMATCH]: 2,
        [QbdDirectOnboardingState.EXPORT_SETTINGS]: 3,
        [QbdDirectOnboardingState.IMPORT_SETTINGS]: 4,
        [QbdDirectOnboardingState.ADVANCED_SETTINGS]: 5,
        [QbdDirectOnboardingState.COMPLETE]: 6
    };

    getOnboardingSteps(currentStep: string, onboardingState: QbdDirectOnboardingState): OnboardingStepper[] {
        this.onboardingSteps = [
          {
            active: false,
            completed: false,
            step: this.translocoService.translate('qbd_direct.configuration.preRequisite.stepName'),
            icon: 'arrow-tail-up-medium',
            route: '/integrations/qbd_direct/onboarding/pre_requisite',
            styleClasses: ['step-name-pre-requisite--text']
          },
          {
            active: false,
            completed: false,
            step: this.translocoService.translate('qbd_direct.configuration.connector.stepName'),
            icon: 'link-vertical-medium',
            route: '/integrations/qbd_direct/onboarding/connector',
            styleClasses: ['step-name-connector--text !tw-left-[-70px]']
          },
          {
            active: false,
            completed: false,
            step: this.translocoService.translate('qbd_direct.configuration.exportSetting.stepName'),
            icon: 'arrow-tail-up-medium',
            route: '/integrations/qbd_direct/onboarding/export_settings',
            styleClasses: ['step-name-export--text']
          },
          {
            active: false,
            completed: false,
            step: this.translocoService.translate('qbd_direct.configuration.importSetting.stepName'),
            icon: 'arrow-tail-down-medium',
            route: '/integrations/qbd_direct/onboarding/import_settings',
            styleClasses: ['step-name-export--text']
          },
          {
            active: false,
            completed: false,
            step: this.translocoService.translate('qbd_direct.configuration.advancedSettings.stepName'),
            icon: 'gear-medium',
            route: '/integrations/qbd_direct/onboarding/advanced_settings',
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

        for (let index = this.onboardingStateStepMap[onboardingState] - 1; index > 0; index--) {
          this.onboardingSteps[index - 1].completed = true;
        }

        return this.onboardingSteps;
    }
}