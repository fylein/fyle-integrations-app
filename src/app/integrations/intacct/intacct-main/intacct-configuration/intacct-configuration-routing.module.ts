import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntacctConfigurationComponent } from './intacct-configuration.component';
import { IntacctExportSettingsComponent } from '../../intacct-shared/intacct-export-settings/intacct-export-settings.component';
import { IntacctImportSettingsComponent } from '../../intacct-shared/intacct-import-settings/intacct-import-settings.component';
import { IntacctAdvancedSettingsComponent } from '../../intacct-shared/intacct-advanced-settings/intacct-advanced-settings.component';

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
        component: IntacctImportSettingsComponent
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
