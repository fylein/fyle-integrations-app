import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Sage300ConfigurationComponent } from './sage300-configuration.component';
import { Sage300ConfigurationExportSettingsComponent } from './sage300-configuration-export-settings/sage300-configuration-export-settings.component';
import { Sage300ConfigurationImportSettingsComponent } from './sage300-configuration-import-settings/sage300-configuration-import-settings.component';
import { Sage300ConfigurationAdvancedSettingsComponent } from './sage300-configuration-advanced-settings/sage300-configuration-advanced-settings.component';

const routes: Routes = [
  {
    path: '',
    component: Sage300ConfigurationComponent,
    children: [
      {
        path: 'export_settings',
        component: Sage300ConfigurationExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: Sage300ConfigurationImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: Sage300ConfigurationAdvancedSettingsComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class Sage300MainRoutingModule { }
