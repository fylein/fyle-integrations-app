import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbdComponent } from './qbd.component';

const routes: Routes = [
  {
    path: '',
    component: QbdComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./qbd-onboarding/qbd-onboarding.module').then((m) => m.QbdOnboardingModule),
      },
      {
        path: 'main',
        loadChildren: () => import('./qbd-main/qbd-main.module').then((m) => m.QbdMainModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QbdRoutingModule {}
