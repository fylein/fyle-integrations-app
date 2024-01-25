import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-intacct-stepper',
  templateUrl: './intacct-stepper.component.html',
  styleUrls: ['./intacct-stepper.component.scss']
})
export class IntacctStepperComponent implements OnInit {

  constructor(
    private router: Router,
    private workspaceService: SiWorkspaceService
  ) { }

  @Input() currentStep: string;

  onboardingSteps: OnboardingStepper[] = [
    {
      active: false,
      completed: false,
      step: 'Connect to Sage Intacct',
      icon: 'link-vertical-medium',
      route: 'connector'
    },
    {
      active: false,
      completed: false,
      step: 'Export Settings',
      icon: 'arrow-tail-up-medium',
      route: 'export_settings'
    },
    {
      active: false,
      completed: false,
      step: 'Import Settings',
      icon: 'arrow-tail-down-medium',
      route: 'import_settings'
    },
    {
      active: false,
      completed: false,
      step: 'Advanced Settings',
      icon: 'gear-medium',
      route: 'advanced_settings'
    }
  ];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  private updateActiveAndCompletedSteps(): void {
    this.onboardingSteps.forEach(step => {
      if (step.step === this.currentStep) {
        step.active = true;
      }
    });
    const onboardingState: IntacctOnboardingState = this.workspaceService.getIntacctOnboardingState();
    const onboardingStateStepMap = {
      [IntacctOnboardingState.CONNECTION]: 1,
      [IntacctOnboardingState.LOCATION_ENTITY]: 2,
      [IntacctOnboardingState.EXPORT_SETTINGS]: 3,
      [IntacctOnboardingState.IMPORT_SETTINGS]: 4,
      [IntacctOnboardingState.ADVANCED_CONFIGURATION]: 5,
      [IntacctOnboardingState.COMPLETE]: 6
    };

    for (let index = onboardingStateStepMap[onboardingState] - 2; index > 0; index--) {
      this.onboardingSteps[index - 1].completed = true;
    }
  }

  navigate(canNavigate: boolean, route: string): void {
    if (canNavigate) {
      this.router.navigate([`/integrations/intacct/onboarding/${route}`]);
    }
  }

  ngOnInit(): void {
    this.updateActiveAndCompletedSteps();
  }
}
