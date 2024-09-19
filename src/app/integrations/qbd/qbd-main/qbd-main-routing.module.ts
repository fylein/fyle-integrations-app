import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { QbdMainComponent } from './qbd-main.component';

const routes: Routes = [
  {
    path: '',
    component: QbdMainComponent,
    children: [
      {
        path: 'configuration',
        loadChildren: () => import('./qbd-configuration/qbd-configuration.module').then(m => m.QbdConfigurationModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./qbd-dashboard/qbd-dashboard.module').then(m => m.QbdDashboardModule)
      },
      {
        path: 'mapping',
        loadChildren: () => import('./qbd-mapping/qbd-mapping.module').then(m => m.QbdMappingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
