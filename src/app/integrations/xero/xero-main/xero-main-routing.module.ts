import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroMainComponent } from './xero-main.component';

const routes: Routes = [
  {
    path: '',
    component: XeroMainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./xero-dashboard/xero-dashboard.module').then(m => m.XeroDashboardModule)
      },
      {
        path: 'configuration',
        loadChildren: () => import('./xero-configuration/xero-configuration.module').then(m => m.XeroConfigurationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XeroMainRoutingModule { }
