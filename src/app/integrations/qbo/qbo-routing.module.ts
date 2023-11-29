import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QboComponent } from './qbo.component';

const routes: Routes = [
  {
    path: '',
    component: QboComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () => import('./qbo-onboarding/qbo-onboarding.module').then(m => m.QboOnboardingModule)
      },
      {
        path: 'main',
        loadChildren: () => import('./qbo-main/qbo-main.module').then(m => m.QboMainModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboRoutingModule { }
