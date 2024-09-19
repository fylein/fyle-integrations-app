import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Sage300ConfigurationComponent } from './sage300-configuration.component';
import { Sage300ExportSettingsComponent } from '../../sage300-shared/sage300-export-settings/sage300-export-settings.component';
import { Sage300ImportSettingsComponent } from '../../sage300-shared/sage300-import-settings/sage300-import-settings.component';
import { Sage300AdvancedSettingsComponent } from '../../sage300-shared/sage300-advanced-settings/sage300-advanced-settings.component';

const routes: Routes = [
  {
    path: '',
    component: Sage300ConfigurationComponent,
    children: [
      {
        path: 'export_settings',
        component: Sage300ExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: Sage300ImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: Sage300AdvancedSettingsComponent
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
export class Sage300ConfigurationRoutingModule { }
