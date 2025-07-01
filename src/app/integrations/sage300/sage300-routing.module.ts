import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sage300Component } from './sage300.component';
import { Sage300TokenGuard } from 'src/app/core/guard/sage300-token.guard';

const routes: Routes = [
  {
    path: '',
    component: Sage300Component,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./sage300-onboarding/sage300-onboarding.module').then(m => m.Sage300OnboardingModule)
      },
      {
        path: 'main',
        loadChildren: () => import('./sage300-main/sage300-main.module').then(m => m.Sage300MainModule),
        canActivate: [Sage300TokenGuard]
      },
      {
        path: 'token_expired',
        loadChildren: () => import('./sage300-main/sage300-main.module').then(m => m.Sage300MainModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Sage300RoutingModule { }
