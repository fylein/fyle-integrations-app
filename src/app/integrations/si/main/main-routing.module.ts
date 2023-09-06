import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'export_log',
        loadChildren: () => import('./export-log/export-log.module').then(m => m.ExportLogModule)
      },
      {
        path: 'mapping',
        loadChildren: () => import('./mapping/mapping.module').then(m => m.MappingModule)
      },
      {
        path: 'configuration',
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
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
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule { }
