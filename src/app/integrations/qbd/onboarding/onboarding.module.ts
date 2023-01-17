import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnboardingRoutingModule } from './onboarding-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    SharedModule
  ]
})
export class OnboardingModule { }
