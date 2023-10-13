import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppName, IntacctOnboardingState, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';

@Component({
  selector: 'app-onboarding-stepper',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.scss']
})
export class OnboardingStepperComponent implements OnInit {

  @Input() currentStep: string;

  @Input() appName: AppName;

  @Input() onboardingSteps: OnboardingStepper[];

  @Input() onboardingState: IntacctOnboardingState | QBDOnboardingState;

  @Input() onboardingStateStepMap: any;

  @Output() onStepClick = new EventEmitter<string>();

  constructor() { }

  private updateActiveAndCompletedSteps(): void {
    this.onboardingSteps.forEach(step => {
      if (step.step === this.currentStep) {
        step.active = true;
      }
    });

    for (let index = this.onboardingStateStepMap[this.onboardingState] - 2; index > 0; index--) {
      this.onboardingSteps[index - 1].completed = true;
    }
  }

  navigate(canNavigate: boolean, route: string): void {
    if (canNavigate) {
      this.onStepClick.emit(route)
    }
  }

  ngOnInit(): void {
    this.updateActiveAndCompletedSteps();
  }

}
