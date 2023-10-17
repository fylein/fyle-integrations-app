import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sage300OnboardingComponent } from './sage300-onboarding.component';
import { Sage300OnboardingLandingComponent } from './sage300-onboarding-landing/sage300-onboarding-landing.component';


const routes: Routes = [
  {
    path: '',
    component: Sage300OnboardingComponent,
    children: [
      {
        path: 'landing',
        component: Sage300OnboardingLandingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Sage300OnboardingRoutingModule { }
