import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QboMainComponent } from './qbo-main.component';

const routes: Routes = [
  {
    path: '',
    component: QboMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./qbo-dashboard/qbo-dashboard.module').then((m) => m.QboDashboardModule),
      },
      {
        path: 'export_log',
        loadChildren: () => import('./qbo-export-log/qbo-export-log.module').then((m) => m.QboExportLogModule),
      },
      {
        path: 'mapping',
        loadChildren: () => import('./qbo-mapping/qbo-mapping.module').then((m) => m.QboMappingModule),
      },
      {
        path: 'configuration',
        loadChildren: () =>
          import('./qbo-configuration/qbo-configuration.module').then((m) => m.QboConfigurationModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QboMainRoutingModule {}
