import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NetsuiteComponent } from './netsuite.component';

const routes: Routes = [
  {
    path: '',
    component: NetsuiteComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./netsuite-onboarding/netsuite-onboarding.module').then(m => m.NetsuiteOnboardingModule)
      },
      {
        path: 'main',
        loadChildren: () => import('./netsuite-main/netsuite-main.module').then(m => m.NetsuiteMainModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetsuiteRoutingModule { }
