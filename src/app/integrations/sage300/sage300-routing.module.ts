import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sage300Component } from './sage300.component';

const routes: Routes = [
  {
    path: '',
    component: Sage300Component,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./sage300-onboarding/sage300-onboarding.module').then(m => m.Sage300OnboardingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Sage300RoutingModule { }
