import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import type { Router } from '@angular/router';
import { Route } from '@angular/router';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, IntacctOnboardingState, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';

@Component({
  selector: 'app-onboarding-steppers',
  templateUrl: './onboarding-stepper.component.html',
  styleUrls: ['./onboarding-stepper.component.scss']
})
export class OnboardingSteppersComponent implements OnInit {

  @Input() onboardingSteps: OnboardingStepper[];

  @Input() isCloneSettingView: boolean;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private router: Router
  ) { }

  navigate(canNavigate: boolean, route: string): void {
    if (canNavigate) {
      this.router.navigate([route]);
    }
  }

  ngOnInit(): void {
  }

}
