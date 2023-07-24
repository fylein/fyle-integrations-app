import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnboardingIntacctConnectorComponent } from './onboarding-intacct-connector/onboarding-intacct-connector.component';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { OnboardingComponent } from './onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OnboardingIntacctConnectorComponent,
    OnboardingLandingComponent,
    OnboardingComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OnboardingModule { }
