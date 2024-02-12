import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'onboarding',
    loadChildren: () => import('./netsuite-onboarding/netsuite-onboarding.module').then(m => m.NetsuiteOnboardingModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./netsuite-main/netsuite-main.module').then(m => m.NetsuiteMainModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetsuiteRoutingModule { }
