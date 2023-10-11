import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { Sage300OnboardingLandingComponent } from './sage300-onboarding-landing/sage300-onboarding-landing.component';



@NgModule({
  declarations: [
    OnboardingLandingComponent,
    Sage300OnboardingLandingComponent
  ],
  imports: [
    CommonModule
  ]
})
export class OnboardingModule { }
