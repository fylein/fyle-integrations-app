import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QbdDirectMainComponent } from './qbd-direct-main.component';



const routes: Routes = [
  {
    path: '',
    component: QbdDirectMainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./qbd-direct-dashboard/qbd-direct-dashboard.module').then(m => m.QbdDirectDashboardModule)
      },
      {
        path: 'export_log',
        loadChildren: () => import('./qbd-direct-export-log/qbd-direct-export-log.module').then(m => m.QbdDirectExportLogModule)
      },
      {
        path: 'mapping',
        loadChildren: () => import('./qbd-direct-mapping/qbd-direct-mapping.module').then(m => m.QbdDirectMappingModule)
      },
      {
        path: 'configuration',
        loadChildren: () => import('./qbd-direct-configuration/qbd-direct-configuration.module').then(m => m.QbdDirectConfigurationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class QbdDirectMainRoutingModule { }
