import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelperkPaymentProfileSettingsComponent } from './travelperk-payment-profile-settings/travelperk-payment-profile-settings.component';
import { TravelperkAdvancedSettingsComponent } from './travelperk-advanced-settings/travelperk-advanced-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [TravelperkPaymentProfileSettingsComponent, TravelperkAdvancedSettingsComponent],
  imports: [CommonModule, SharedModule],
  exports: [TravelperkPaymentProfileSettingsComponent, TravelperkAdvancedSettingsComponent],
})
export class TravelperkSharedModule {}
