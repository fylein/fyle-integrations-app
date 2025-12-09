import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelperkOnboardingRoutingModule } from './travelperk-onboarding-routing.module';
import { TravelperkOnboardingDoneComponent } from './travelperk-onboarding-done/travelperk-onboarding-done.component';
import { TravelperkOnboardingLandingComponent } from './travelperk-onboarding-landing/travelperk-onboarding-landing.component';
import { TravelperkOnboardingAdvancedSettingsComponent } from './travelperk-onboarding-advanced-settings/travelperk-onboarding-advanced-settings.component';
import { TravelperkOnboardingPaymentProfileSettingsComponent } from './travelperk-onboarding-payment-profile-settings/travelperk-onboarding-payment-profile-settings.component';
import { TravelperkSharedModule } from '../travelperk-shared/travelperk-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [
    TravelperkOnboardingDoneComponent,
    TravelperkOnboardingLandingComponent,
    TravelperkOnboardingAdvancedSettingsComponent,
    TravelperkOnboardingPaymentProfileSettingsComponent,
  ],
  imports: [CommonModule, TravelperkSharedModule, SharedModule, SkeletonModule, TravelperkOnboardingRoutingModule],
})
export class TravelperkOnboardingModule {}
