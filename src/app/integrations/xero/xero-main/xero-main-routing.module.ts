import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroMainComponent } from './xero-main.component';

const routes: Routes = [
  {
    path: '',
    component: XeroMainComponent,
    children: [
      // {
      //   Path: 'dashboard',
      //   LoadChildren: () => import('./xero-dashboard/xero-dashboard.module').then(m => m.XeroDashboardModule)
      // },
      {
        path: 'configuration',
        loadChildren: () => import('./xero-configuration/xero-configuration.module').then(m => m.XeroConfigurationModule)
      }
      // {
      //   Path: 'mapping',
      //   LoadChildren: () => import('./xero-mapping/xero-mapping.module').then(m => m.XeroMappingModule)
      // },
      // {
      //   Path: 'export_log',
      //   LoadChildren: () => import('./xero-export-log/xero-export-log.module').then(m => m.XeroExportLogModule)
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XeroMainRoutingModule { }
