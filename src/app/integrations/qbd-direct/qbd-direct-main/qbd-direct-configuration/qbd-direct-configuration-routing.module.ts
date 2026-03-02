import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbdDirectAdvancedSettingsComponent } from '../../qbd-direct-shared/qbd-direct-advanced-settings/qbd-direct-advanced-settings.component';
import { QbdDirectExportSettingsComponent } from '../../qbd-direct-shared/qbd-direct-export-settings/qbd-direct-export-settings.component';
import { QbdDirectImportSettingsComponent } from '../../qbd-direct-shared/qbd-direct-import-settings/qbd-direct-import-settings.component';
import { QbdDirectConfigurationComponent } from './qbd-direct-configuration.component';
import { QbdDirectQwcFileLandingComponent } from '../../qbd-direct-shared/qbd-direct-qwc-file/qbd-direct-qwc-file-landing/qbd-direct-qwc-file-landing.component';
import { QbdDirectRegenerateQwcFileComponent } from '../../qbd-direct-shared/qbd-direct-qwc-file/qbd-direct-regenerate-qwc-file/qbd-direct-regenerate-qwc-file.component';
import { QwcRegenerationFlowType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-qwc-file.model';

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
        children: [
          {
            path: '',
            component: QbdDirectQwcFileLandingComponent
          },
          {
            path: 'existing',
            component: QbdDirectRegenerateQwcFileComponent,
            data: { flowType: QwcRegenerationFlowType.EXISTING }
          },
          {
            path: 'new',
            component: QbdDirectRegenerateQwcFileComponent,
            data: { flowType: QwcRegenerationFlowType.NEW }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class QbdDirectConfigurationRoutingModule { }
