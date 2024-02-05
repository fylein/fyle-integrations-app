import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntacctComponent } from './intacct.component';

const routes: Routes = [
  {
    path: '',
    component: IntacctComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./intacct-onboarding/onboarding.module').then(m => m.OnboardingModule)
      },
      {
        path: 'main',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiRoutingModule { }
