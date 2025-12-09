import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntacctComponent } from './intacct.component';
import { IntacctTokenGuard } from 'src/app/core/guard/intacct-token.guard';

const routes: Routes = [
  {
    path: '',
    component: IntacctComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () =>
          import('./intacct-onboarding/intacct-onboarding.module').then((m) => m.IntacctOnboardingModule),
      },
      {
        path: 'main',
        loadChildren: () => import('./intacct-main/main.module').then((m) => m.MainModule),
        canActivate: [IntacctTokenGuard],
      },
      {
        path: 'token_expired',
        loadChildren: () => import('./intacct-main/main.module').then((m) => m.MainModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiRoutingModule {}
