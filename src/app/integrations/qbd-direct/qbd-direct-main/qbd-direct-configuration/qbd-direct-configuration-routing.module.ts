import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbdDirectAdvancedSettingsComponent } from '../../qbd-direct-shared/qbd-direct-advanced-settings/qbd-direct-advanced-settings.component';
import { QbdDirectExportSettingsComponent } from '../../qbd-direct-shared/qbd-direct-export-settings/qbd-direct-export-settings.component';
import { QbdDirectImportSettingsComponent } from '../../qbd-direct-shared/qbd-direct-import-settings/qbd-direct-import-settings.component';
import { QbdDirectConfigurationComponent } from './qbd-direct-configuration.component';
import { QbdDirectQwcFileLandingComponent } from '../../qbd-direct-shared/qbd-direct-qwc-file/qbd-direct-qwc-file-landing/qbd-direct-qwc-file-landing.component';

const routes: Routes = [
  {
    path: '',
    component: QbdDirectConfigurationComponent,
    children: [
      {
        path: 'export_settings',
        component: QbdDirectExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: QbdDirectImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: QbdDirectAdvancedSettingsComponent
      },
      {
        path: 'qwc_file',
        component: QbdDirectQwcFileLandingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class QbdDirectConfigurationRoutingModule { }
