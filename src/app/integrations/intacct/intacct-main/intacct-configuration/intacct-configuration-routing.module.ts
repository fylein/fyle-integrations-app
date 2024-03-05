import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntacctConfigurationComponent } from './intacct-configuration.component';
import { IntacctExportSettingsComponent } from '../../intacct-shared/intacct-export-settings/intacct-export-settings.component';
import { IntacctImportSettingsComponent } from '../../intacct-shared/intacct-import-settings/intacct-import-settings.component';
import { IntacctAdvancedSettingsComponent } from '../../intacct-shared/intacct-advanced-settings/intacct-advanced-settings.component';
import { brandingConfig } from 'src/app/branding/branding-config';
import { IntacctC1ImportSettingsComponent } from '../../intacct-shared/intacct-c1-import-settings/intacct-c1-import-settings.component';

const routes: Routes = [
  {
    path: '',
    component: IntacctConfigurationComponent,
    children: [
      {
        path: 'export_settings',
        component: IntacctExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: brandingConfig.brandId === 'fyle' ? IntacctImportSettingsComponent : IntacctC1ImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: IntacctAdvancedSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntacctConfigurationRoutingModule { }
