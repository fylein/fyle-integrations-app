import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppName, IntacctOnboardingState, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';

@Component({
  selector: 'app-onboarding-steppers',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.scss']
})
export class OnboardingSteppersComponent implements OnInit {

  @Input() appName: AppName;

  @Input() onboardingSteps: OnboardingStepper[];

  constructor(
    private router: Router
  ) { }

  navigate(canNavigate: boolean, route: string): void {
    if (canNavigate) {
      this.router.navigate([route]);
    }
  }

  stepperStyle(onboardingstep: string): string {
    if (onboardingstep === 'Connect to ' + this.appName) {
      return 'step-name-connector';
    } else if (onboardingstep === 'Export Settings') {
      return 'step-name-export';
    } else if (onboardingstep === 'Import Settings' || onboardingstep === 'Field Mapping') {
      return 'step-name-import';
    }
    return 'step-name-advanced';
  }

  ngOnInit(): void {
  }

}
