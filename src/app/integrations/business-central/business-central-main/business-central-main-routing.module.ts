import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BusinessCentralMainComponent } from './business-central-main.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessCentralMainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./business-central-dashboard/business-central-dashboard.module').then(m => m.BusinessCentralDashboardModule)
      },
      {
        path: 'export_log',
        loadChildren: () => import('./business-central-export-log/business-central-export-log.module').then(m => m.BusinessCentralExportLogModule)
      },
      {
        path: 'mapping',
        loadChildren: () => import('./business-central-mapping/business-central-mapping.module').then(m => m.BusinessCentralMappingModule)
      },
      {
        path: 'configuration',
        loadChildren: () => import('./business-central-configuration/business-central-configuration.module').then(m => m.BusinessCentralConfigurationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessCentralMainRoutingModule { }
