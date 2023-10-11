import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { Sage300RoutingModule } from './sage300-routing.module';



@NgModule({
  declarations: [
    OnboardingComponent
  ],
  imports: [
    CommonModule,
    Sage300RoutingModule
  ]
})
export class Sage300Module { }
