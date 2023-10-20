import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300OnboardingComponent } from './sage300-onboarding/sage300-onboarding.component';
import { Sage300RoutingModule } from './sage300-routing.module';
import { Sage300MainComponent } from './sage300-main/sage300-main.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    Sage300OnboardingComponent,
    Sage300MainComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Sage300RoutingModule
  ]
})
export class Sage300Module { }
