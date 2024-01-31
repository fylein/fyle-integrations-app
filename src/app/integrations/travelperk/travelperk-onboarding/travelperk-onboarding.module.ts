import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelperkOnboardingRoutingModule } from './travelperk-onboarding-routing.module';
import { TravelperkOnboardingDoneComponent } from './travelperk-onboarding-done/travelperk-onboarding-done.component';
import { TravelperkOnboardingLandingComponent } from './travelperk-onboarding-landing/travelperk-onboarding-landing.component';
import { TravelperkOnboardingAdvancedSettingsComponent } from './travelperk-onboarding-advanced-settings/travelperk-onboarding-advanced-settings.component';
import { TravelperkOnboardingPaymentProfileSettingsComponent } from './travelperk-onboarding-payment-profile-settings/travelperk-onboarding-payment-profile-settings.component';


@NgModule({
  declarations: [
    TravelperkOnboardingDoneComponent,
    TravelperkOnboardingLandingComponent,
    TravelperkOnboardingAdvancedSettingsComponent,
    TravelperkOnboardingPaymentProfileSettingsComponent
  ],
  imports: [
    CommonModule,
    TravelperkOnboardingRoutingModule
  ]
})
export class TravelperkOnboardingModule { }
