import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FyleIntegrationsSharedModule } from 'fyle-child';

import { IntegrationsSettingsSharedModule } from 'src/app/shared/shared.module';
import { OnboardingRoutingModule } from './onboarding-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    IntegrationsSettingsSharedModule,
    FyleIntegrationsSharedModule
  ]
})
export class OnboardingModule { }
