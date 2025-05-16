import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './intacct-main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./intacct-dashboard/intacct-dashboard.module').then(m => m.IntacctDashboardModule)
      },
      {
        path: 'export_log',
        loadChildren: () => import('./intacct-export-log/intacct-export-log.module').then(m => m.IntacctExportLogModule)
      },
      {
        path: 'mapping',
        loadChildren: () => import('./intacct-mapping/intacct-mapping.module').then(m => m.IntacctMappingModule)
      },
      {
        path: 'configuration',
        loadChildren: () => import('./intacct-configuration/intacct-configuration.module').then(m => m.IntacctConfigurationModule)
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
export class MainRoutingModule { }
