import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbdConfigurationAdvancedSettingComponent } from './qbd-configuration-advanced-setting/qbd-configuration-advanced-setting.component';
import { QbdConfigurationExportSettingComponent } from './qbd-configuration-export-setting/qbd-configuration-export-setting.component';
import { QbdConfigurationFieldSettingComponent } from './qbd-configuration-field-setting/qbd-configuration-field-setting.component';
import { QbdConfigurationComponent } from './qbd-configuration.component';

const routes: Routes = [
  {
    path: '',
    component: QbdConfigurationComponent,
    children: [
      {
        path: 'export_settings',
        component: QbdConfigurationExportSettingComponent,
      },
      {
        path: 'field_mapping',
        component: QbdConfigurationFieldSettingComponent,
      },
      {
        path: 'advanced_settings',
        component: QbdConfigurationAdvancedSettingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
