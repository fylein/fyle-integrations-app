import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QBDOnboardingStepper } from 'src/app/core/models/qbd/misc/qbd-onboarding-stepper.model';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

@Component({
  selector: 'app-onboarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.scss']
})
export class OnboardingStepperComponent implements OnInit {

  constructor(
    private router: Router,
    private workspaceService: QbdWorkspaceService
  ) { }

  @Input() currentStep: string;

  onboardingSteps: QBDOnboardingStepper[] = [
    {
      active: false,
      completed: false,
      number: 2,
      step: 'Export Settings',
      icon: 'export-setting',
      route: 'export_settings',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 3,
      step: 'Field Mapping',
      icon: 'field-mapping',
      route: 'field_mappings',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 4,
      step: 'Advanced',
      icon: 'advanced-setting',
      route: 'advanced_settings',
      size: {
        height: '20px',
        width: '20px'
      }
    }
  ];

  private updateActiveAndCompletedSteps(): void {
    this.onboardingSteps.forEach(step => {
      if (step.step === this.currentStep) {
        step.active = true;
      }
    });
    const onboardingState: QBDOnboardingState = this.workspaceService.getOnboardingState();

    const onboardingStateStepMap = {
      [QBDOnboardingState.CONNECTION]: 1,
      [QBDOnboardingState.EXPORT_SETTINGS]: 2,
      [QBDOnboardingState.FIELD_MAPPING]: 3,
      [QBDOnboardingState.ADVANCED_CONFIGURATION]: 4,
      [QBDOnboardingState.COMPLETE]: 5
    };
    for (let index = onboardingStateStepMap[onboardingState] - 1; index > 0; index--) {
      this.onboardingSteps[index - 1].completed = true;
    }
  }

  navigate(canNavigate: boolean, route: string): void {
    if (canNavigate) {
      this.router.navigate([`/workspaces/onboarding/${route}`]);
    }
  }

  ngOnInit(): void {
    this.updateActiveAndCompletedSteps();
  }

}
