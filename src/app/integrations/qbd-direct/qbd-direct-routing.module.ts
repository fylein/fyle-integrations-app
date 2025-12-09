import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QbdDirectComponent } from './qbd-direct.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: QbdDirectComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () =>
          import('./qbd-direct-onboarding/qbd-direct-onboarding.module').then((m) => m.QbdDirectOnboardingModule),
      },
      {
        path: 'main',
        loadChildren: () => import('./qbd-direct-main/qbd-direct-main.module').then((m) => m.QbdDirectMainModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QbdDirectRoutingModule {}
