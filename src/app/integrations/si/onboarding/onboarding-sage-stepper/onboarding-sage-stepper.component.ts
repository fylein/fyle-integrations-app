import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-onboarding-sage-stepper',
  templateUrl: './onboarding-sage-stepper.component.html',
  styleUrls: ['./onboarding-sage-stepper.component.scss']
})
export class OnboardingSageStepperComponent implements OnInit {

  constructor(
    private router: Router,
    private workspaceService: SiWorkspaceService
  ) { }

  @Input() currentStep: string;

  onboardingSteps: OnboardingStepper[] = [
    {
      active: false,
      completed: false,
      number: 1,
      step: 'Connect to Sage Intacct',
      icon: 'connector',
      route: 'connector',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 2,
      step: 'Export Settings',
      icon: 'export-settings',
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
      step: 'Import Settings',
      icon: 'import-settings',
      route: 'import_settings',
      size: {
        height: '18px',
        width: '15px'
      }
    },
    {
      active: false,
      completed: false,
      number: 4,
      step: 'Advanced Settings',
      icon: 'advanced-settings',
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
    const onboardingState: IntacctOnboardingState = this.workspaceService.getIntacctOnboardingState();
    const onboardingStateStepMap = {
      [IntacctOnboardingState.CONNECTION]: 1,
      [IntacctOnboardingState.LOCATION_ENTITY]: 2,
      [IntacctOnboardingState.EXPORT_SETTINGS]: 3,
      [IntacctOnboardingState.IMPORT_SETTINGS]: 4,
      [IntacctOnboardingState.ADVANCED_SETTINGS]: 5,
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
