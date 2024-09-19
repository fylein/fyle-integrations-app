import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { QboConfigurationComponent } from './qbo-configuration.component';
import { QboEmployeeSettingsComponent } from '../../qbo-shared/qbo-employee-settings/qbo-employee-settings.component';
import { QboExportSettingsComponent } from '../../qbo-shared/qbo-export-settings/qbo-export-settings.component';
import { QboImportSettingsComponent } from '../../qbo-shared/qbo-import-settings/qbo-import-settings.component';
import { QboAdvancedSettingsComponent } from '../../qbo-shared/qbo-advanced-settings/qbo-advanced-settings.component';

const routes: Routes = [
  {
    path: '',
    component: QboConfigurationComponent,
    children: [
      {
        path: 'employee_settings',
        component: QboEmployeeSettingsComponent
      },
      {
        path: 'export_settings',
        component: QboExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: QboImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: QboAdvancedSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboConfigurationRoutingModule { }
