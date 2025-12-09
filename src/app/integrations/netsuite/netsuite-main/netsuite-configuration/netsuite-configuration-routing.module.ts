import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetsuiteConfigurationComponent } from './netsuite-configuration.component';
import { NetsuiteExportSettingsComponent } from '../../netsuite-shared/netsuite-export-settings/netsuite-export-settings.component';
import { NetsuiteImportSettingsComponent } from '../../netsuite-shared/netsuite-import-settings/netsuite-import-settings.component';
import { NetsuiteAdvancedSettingsComponent } from '../../netsuite-shared/netsuite-advanced-settings/netsuite-advanced-settings.component';
import { NetsuiteConnectorComponent } from 'src/app/shared/components/netsuite/core/netsuite-connector/netsuite-connector.component';

const routes: Routes = [
  {
    path: '',
    component: NetsuiteConfigurationComponent,
    children: [
      {
        path: 'connector',
        component: NetsuiteConnectorComponent,
      },
      {
        path: 'export_settings',
        component: NetsuiteExportSettingsComponent,
      },
      {
        path: 'import_settings',
        component: NetsuiteImportSettingsComponent,
      },
      {
        path: 'advanced_settings',
        component: NetsuiteAdvancedSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetsuiteConfigurationRoutingModule {}
