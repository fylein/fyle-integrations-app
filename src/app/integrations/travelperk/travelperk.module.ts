import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelperkRoutingModule } from './travelperk-routing.module';
import { TravelperkComponent } from './travelperk.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { TravelperkMainComponent } from './travelperk-main/travelperk-main.component';
import { TravelperkOnboardingComponent } from './travelperk-onboarding/travelperk-onboarding.component';
import { TravelperkAdvancedSettingsComponent } from './travelperk-shared/travelperk-advanced-settings/travelperk-advanced-settings.component';
import { TravelperkPaymentProfileSettingsComponent } from './travelperk-shared/travelperk-payment-profile-settings/travelperk-payment-profile-settings.component';
import { TravelperkOnboardingPaymentProfileSettingsComponent } from './travelperk-onboarding/travelperk-onboarding-payment-profile-settings/travelperk-onboarding-payment-profile-settings.component';
import { TravelperkOnboardingAdvancedSettingsComponent } from './travelperk-onboarding/travelperk-onboarding-advanced-settings/travelperk-onboarding-advanced-settings.component';
import { TravelperkConfigurationComponent } from './travelperk-main/travelperk-configuration/travelperk-configuration.component';
import { TravelperkSharedModule } from './travelperk-shared/travelperk-shared.module';

@NgModule({
  declarations: [TravelperkMainComponent, TravelperkOnboardingComponent],
  imports: [CommonModule, SharedModule, TravelperkSharedModule, TravelperkRoutingModule],
})
export class TravelperkModule {}
