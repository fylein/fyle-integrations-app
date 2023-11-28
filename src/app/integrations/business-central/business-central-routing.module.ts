import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'onboarding',
    loadChildren: () => import('./business-central-onboarding/business-central-onboarding.module').then(m => m.BusinessCentralOnboardingModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./business-central-main/business-central-main.module').then(m => m.BusinessCentralMainModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessCentralRoutingModule { }
