import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TravelperkAdvancedSettingsComponent } from '../../travelperk-shared/travelperk-advanced-settings/travelperk-advanced-settings.component';
import { TravelperkPaymentProfileSettingsComponent } from '../../travelperk-shared/travelperk-payment-profile-settings/travelperk-payment-profile-settings.component';
import { TravelperkConfigurationComponent } from './travelperk-configuration.component';

const routes: Routes = [
  {
    path: '',
    component: TravelperkConfigurationComponent,
    children: [
      {
        path: 'payment_profile_settings',
        component: TravelperkPaymentProfileSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: TravelperkAdvancedSettingsComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelperkConfigurationRoutingModule { }
