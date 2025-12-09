import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroMainComponent } from './xero-main.component';

const routes: Routes = [
  {
    path: '',
    component: XeroMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./xero-dashboard/xero-dashboard.module').then((m) => m.XeroDashboardModule),
      },
      {
        path: 'configuration',
        loadChildren: () =>
          import('./xero-configuration/xero-configuration.module').then((m) => m.XeroConfigurationModule),
      },
      {
        path: 'export_log',
        loadChildren: () => import('./xero-export-log/xero-export-log.module').then((m) => m.XeroExportLogModule),
      },
      {
        path: 'mapping',
        loadChildren: () => import('./xero-mapping/xero-mapping.module').then((m) => m.XeroMappingModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XeroMainRoutingModule {}
