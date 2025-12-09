import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-onboarding-stepper',
  templateUrl: './qbd-onboarding-stepper.component.html',
  styleUrls: ['./qbd-onboarding-stepper.component.scss'],
  standalone: false,
})
export class QbdOnboardingStepperComponent implements OnInit {
  constructor(
    private router: Router,
    private workspaceService: QbdWorkspaceService,
    private translocoService: TranslocoService,
  ) {}

  @Input() currentStep: string;

  onboardingSteps: OnboardingStepper[];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  private updateActiveAndCompletedSteps(): void {
    this.onboardingSteps.forEach((step) => {
      if (step.step === this.currentStep) {
        step.active = true;
      }
    });
    const onboardingState: QBDOnboardingState = this.workspaceService.getOnboardingState();
    const onboardingStateStepMap = {
      [QBDOnboardingState.CONNECTION]: 1,
      [QBDOnboardingState.EXPORT_SETTINGS]: 2,
      [QBDOnboardingState.FIELD_MAPPINGS]: 3,
      [QBDOnboardingState.ADVANCED_SETTINGS]: 4,
      [QBDOnboardingState.COMPLETE]: 5,
    };
    for (let index = onboardingStateStepMap[onboardingState] - 2; index > 0; index--) {
      this.onboardingSteps[index - 1].completed = true;
    }
  }

  navigate(canNavigate: boolean, route: string): void {
    if (canNavigate) {
      this.router.navigate([`/integrations/qbd/onboarding/${route}`]);
    }
  }

  ngOnInit(): void {
    this.onboardingSteps = [
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('qbdOnboardingStepper.exportSettings'),
        icon: 'arrow-tail-up-medium',
        route: 'export_settings',
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('qbdOnboardingStepper.fieldMapping'),
        icon: 'mapping-medium',
        route: 'field_mappings',
      },
      {
        active: false,
        completed: false,
        step: this.translocoService.translate('qbdOnboardingStepper.advanced'),
        icon: 'gear-medium',
        route: 'advanced_settings',
      },
    ];
    this.updateActiveAndCompletedSteps();
  }
}
