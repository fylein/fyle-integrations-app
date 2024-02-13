import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationExportSettingComponent } from './configuration-export-setting/configuration-export-setting.component';
import { ConfigurationImportSettingComponent } from './configuration-import-setting/configuration-import-setting.component';
import { ConfigurationAdvancedSettingComponent } from './configuration-advanced-setting/configuration-advanced-setting.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      {
        path: 'export_settings',
        component: ConfigurationExportSettingComponent
      },
      {
        path: 'import_settings',
        component: ConfigurationImportSettingComponent
      },
      {
        path: 'advanced_settings',
        component: ConfigurationAdvancedSettingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
