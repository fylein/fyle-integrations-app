import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './onboarding/onboarding-landing/landing.component';
import { QbdComponent } from './qbd.component';

const routes: Routes = [
  {
    path: '',
    component: QbdComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingModule)
      },
      {
        path: 'main',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule)
        // CanActivate: [WorkspacesGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QbdRoutingModule { }
