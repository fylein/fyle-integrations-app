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
        path: 'landing',
        component: LandingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QbdRoutingModule { }
