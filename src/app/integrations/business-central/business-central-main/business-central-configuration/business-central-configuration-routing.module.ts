import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessCentralConfigurationComponent } from './business-central-configuration.component';
import { BusinessCentralExportLogComponent } from '../business-central-export-log/business-central-export-log.component';
import { BusinessCentralImportSettingsComponent } from '../../business-central-shared/business-central-import-settings/business-central-import-settings.component';
import { BusinessCentralAdvancedSettingsComponent } from '../../business-central-shared/business-central-advanced-settings/business-central-advanced-settings.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessCentralConfigurationComponent,
    children: [
      {
        path: 'export_settings',
        component: BusinessCentralExportLogComponent
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
