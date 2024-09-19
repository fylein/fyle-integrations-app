import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IntegrationsComponent } from './integrations.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: IntegrationsComponent,
    children: [
      {
        path: 'landing',
        component: LandingComponent
      },
      {
        path: 'bamboo_hr',
        loadChildren: () => import('./bamboo-hr/bamboo-hr.module').then(m => m.BambooHrModule)
      },
      {
        path: 'qbd',
        loadChildren: () => import('./qbd/qbd.module').then(m => m.QbdModule)
      },
      {
        path: 'travelperk',
        loadChildren: () => import('./travelperk/travelperk.module').then(m => m.TravelperkModule)
      },
      {
        path: 'intacct',
        loadChildren: () => import('./intacct/intacct.module').then(m => m.IntacctModule)
      },
      {
        path: 'sage300',
        loadChildren: () => import('./sage300/sage300.module').then(m => m.Sage300Module)
      },
      {
        path: 'qbo',
        loadChildren: () => import('./qbo/qbo.module').then(m => m.QboModule)
      },
      {
        path: 'business_central',
        loadChildren: () => import('./business-central/business-central.module').then(m => m.BusinessCentralModule)
      },
      {
        path: 'netsuite',
        loadChildren: () => import('./netsuite/netsuite.module').then(m => m.NetsuiteModule)
      },
      {
        path: 'xero',
        loadChildren: () => import('./xero/xero.module').then(m => m.XeroModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationsRoutingModule { }
