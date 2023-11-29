import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessCentralConfigurationComponent } from './business-central-configuration.component';
import { BusinessCentralImportSettingsComponent } from '../../business-central-shared/business-central-import-settings/business-central-import-settings.component';
import { BusinessCentralAdvancedSettingsComponent } from '../../business-central-shared/business-central-advanced-settings/business-central-advanced-settings.component';
import { BusinessCentralEmployeeSettingsComponent } from '../../business-central-shared/business-central-employee-settings/business-central-employee-settings.component';
import { BusinessCentralExportSettingsComponent } from '../../business-central-shared/business-central-export-settings/business-central-export-settings.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessCentralConfigurationComponent,
    children: [
      {
        path: 'employee_settings',
        component: BusinessCentralEmployeeSettingsComponent
      },
      {
        path: 'export_settings',
        component: BusinessCentralExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: BusinessCentralImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: BusinessCentralAdvancedSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessCentralConfigurationRoutingModule { }
