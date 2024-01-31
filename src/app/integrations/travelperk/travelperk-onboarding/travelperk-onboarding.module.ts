import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelperkOnboardingRoutingModule } from './travelperk-onboarding-routing.module';
import { TravelperkOnboardingDoneComponent } from './travelperk-onboarding-done/travelperk-onboarding-done.component';
import { TravelperkOnboardingLandingComponent } from './travelperk-onboarding-landing/travelperk-onboarding-landing.component';


@NgModule({
  declarations: [
    TravelperkOnboardingDoneComponent,
    TravelperkOnboardingLandingComponent
  ],
  imports: [
    CommonModule,
    TravelperkOnboardingRoutingModule
  ]
})
export class TravelperkOnboardingModule { }
