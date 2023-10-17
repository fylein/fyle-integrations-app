import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { Sage300RoutingModule } from './sage300-routing.module';
import { Sage300MainComponent } from './sage300-main/sage300-main.component';



@NgModule({
  declarations: [
    OnboardingComponent,
    Sage300MainComponent
  ],
  imports: [
    CommonModule,
    Sage300RoutingModule
  ]
})
export class Sage300Module { }
