import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        path: 'gusto',
        loadChildren: () => import('./gusto/gusto-routing.module').then(m => m.GustoRoutingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationsRoutingModule { }
