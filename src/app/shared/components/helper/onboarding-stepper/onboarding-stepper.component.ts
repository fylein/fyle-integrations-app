import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Route, Router } from '@angular/router';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, IntacctOnboardingState, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';

@Component({
  selector: 'app-onboarding-steppers',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.scss']
})
export class OnboardingSteppersComponent implements OnInit {

  @Input() onboardingSteps: OnboardingStepper[];

  @Input() isCloneSettingView: boolean;

  @Input() disableFirstTwoSetupIfcompleted: boolean;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private router: Router
  ) { }

  navigate(index: number, canNavigate: boolean, route: string): void {
    if (canNavigate && this.disableFirstTwoSetupIfcompleted === false) {
      this.router.navigate([route]);
    } else if (canNavigate && index !== 0 && index !== 1 && this.disableFirstTwoSetupIfcompleted === true){
      this.router.navigate([route]);
    }
  }

  ngOnInit(): void {
  }

}
