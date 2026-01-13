import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Route, Router } from '@angular/router';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, IntacctOnboardingState, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';

@Component({
    selector: 'app-onboarding-steppers',
    templateUrl: './onboarding-stepper.component.html',
    styleUrls: ['./onboarding-stepper.component.scss'],
    standalone: false
})
export class OnboardingSteppersComponent implements OnInit {

  @Input() onboardingSteps: OnboardingStepper[];

  @Input() isCloneSettingView: boolean;

  @Input() disableConnectionStepsIfCompleted: boolean;

  @Input() disableConfigurationStepsIfTokenInvalid: boolean;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router
  ) { }

  getViewBox(onboardingStep: OnboardingStepper) {
    return onboardingStep.icon === 'upload' ? '0 0 16 16' : '';
  }

  shouldDisableConfigurationSteps(index: number): boolean {
    return ([1, 2, 3].includes(index) && this.disableConfigurationStepsIfTokenInvalid) || ([0, 1].includes(index) && this.disableConnectionStepsIfCompleted);
  }

  navigate(index: number, canNavigate: boolean, route: string): void {
    if (!canNavigate) {
      return;
    }

    if (!this.disableConnectionStepsIfCompleted && !this.disableConfigurationStepsIfTokenInvalid) {
      this.router.navigate([route]);
      return;
    }

    if (this.disableConfigurationStepsIfTokenInvalid){
      return;
    }

    if (index > 1) {
      this.router.navigate([route]);
    }
  }

  ngOnInit(): void {
  }

}
