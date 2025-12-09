import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroAdvancedSettingsComponent } from '../../xero-shared/xero-advanced-settings/xero-advanced-settings.component';
import { XeroExportSettingsComponent } from '../../xero-shared/xero-export-settings/xero-export-settings.component';
import { XeroImportSettingsComponent } from '../../xero-shared/xero-import-settings/xero-import-settings.component';
import { XeroConfigurationComponent } from './xero-configuration.component';

const routes: Routes = [
  {
    path: '',
    component: XeroConfigurationComponent,
    children: [
      {
        path: 'export_settings',
        component: XeroExportSettingsComponent,
      },
      {
        path: 'import_settings',
        component: XeroImportSettingsComponent,
      },
      {
        path: 'advanced_settings',
        component: XeroAdvancedSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XeroConfigurationRoutingModule {}
