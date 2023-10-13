import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300OnboardingLandingComponent } from './sage300-onboarding-landing/sage300-onboarding-landing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnboardingRoutingModule } from './onboarding-routing.module';



@NgModule({
  declarations: [
    Sage300OnboardingLandingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OnboardingRoutingModule
  ]
})
export class OnboardingModule { }
