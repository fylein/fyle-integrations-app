import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboOnboardingRoutingModule } from './qbo-onboarding-routing.module';
import { QboOnboardingComponent } from './qbo-onboarding.component';


@NgModule({
  declarations: [
    QboOnboardingComponent
  ],
  imports: [
    CommonModule,
    QboOnboardingRoutingModule
  ]
})
export class QboOnboardingModule { }
