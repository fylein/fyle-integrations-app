import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TravelperkOnboardingPaymentProfileSettingsComponent } from './travelperk-onboarding-payment-profile-settings/travelperk-onboarding-payment-profile-settings.component';
import { TravelperkOnboardingAdvancedSettingsComponent } from './travelperk-onboarding-advanced-settings/travelperk-onboarding-advanced-settings.component';
import { TravelperkOnboardingComponent } from './travelperk-onboarding.component';
import { TravelperkOnboardingLandingComponent } from './travelperk-onboarding-landing/travelperk-onboarding-landing.component';
import { TravelperkOnboardingDoneComponent } from './travelperk-onboarding-done/travelperk-onboarding-done.component';

const routes: Routes = [
  {
    path: '',
    component: TravelperkOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: TravelperkOnboardingLandingComponent
      },
      {
        path: 'payment_profile_settings',
        component: TravelperkOnboardingPaymentProfileSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: TravelperkOnboardingAdvancedSettingsComponent
      },
      {
        path: 'done',
        component: TravelperkOnboardingDoneComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelperkOnboardingRoutingModule { }
