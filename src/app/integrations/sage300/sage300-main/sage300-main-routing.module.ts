import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Sage300MainComponent } from './sage300-main.component';

const routes: Routes = [
  {
    path: '',
    component: Sage300MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./sage300-dashboard/sage300-dashboard.module').then(m => m.Sage300DashboardModule)
      },
      {
        path: 'configuration',
        loadChildren: () => import('./sage300-configuration/sage300-configuration.module').then(m => m.Sage300ConfigurationModule)
      },
      {
        path: 'mapping',
        loadChildren: () => import('./sage300-mapping/sage300-mapping.module').then(m => m.Sage300MappingModule)
      },
      {
        path: 'export_log',
        loadChildren: () => import('./sage300-export-log/sage300-export-log.module').then(m => m.Sage300ExportLogModule)
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
export class Sage300MainRoutingModule { }
