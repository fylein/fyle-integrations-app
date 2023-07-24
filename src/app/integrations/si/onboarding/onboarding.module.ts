import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnboardingIntacctConnectorComponent } from './onboarding-intacct-connector/onboarding-intacct-connector.component';

@NgModule({
  declarations: [
    OnboardingIntacctConnectorComponent,
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    SharedModule
  ]
})
export class OnboardingModule { }
