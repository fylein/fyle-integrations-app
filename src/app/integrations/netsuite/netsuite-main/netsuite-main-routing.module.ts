import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetsuiteMainComponent } from './netsuite-main.component';

const routes: Routes = [
  {
    path: '',
    component: NetsuiteMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./netsuite-dashboard/netsuite-dashboard.module').then(m => m.NetsuiteDashboardModule)
      },
      {
        path: 'export_log',
        loadChildren: () => import('./netsuite-export-log/netsuite-export-log.module').then(m => m.NetsuiteExportLogModule)
      },
      {
        path: 'mapping',
        loadChildren: () => import('./netsuite-mapping/netsuite-mapping.module').then(m => m.NetsuiteMappingModule)
      },
      {
        path: 'configuration',
        loadChildren: () => import('./netsuite-configuration/netsuite-configuration.module').then(m => m.NetsuiteConfigurationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetsuiteMainRoutingModule { }
