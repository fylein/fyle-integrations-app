import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IntacctComponent } from './intacct.component';

const routes: Routes = [
  {
    path: '',
    component: IntacctComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./intacct-onboarding/intacct-onboarding.module').then(m => m.IntacctOnboardingModule)
      },
      {
        path: 'main',
        loadChildren: () => import('./intacct-main/main.module').then(m => m.MainModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiRoutingModule { }
