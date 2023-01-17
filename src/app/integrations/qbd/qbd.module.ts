import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QbdRoutingModule } from './qbd-routing.module';
import { LandingComponent } from './onboarding/onboarding-landing/landing.component';
import { ConfigurationComponent } from './main/configuration/configuration.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { OnboardingDoneComponent } from './onboarding/onboarding-done/onboarding-done.component';
import { OnboardingExportSettingComponent } from './onboarding/onboarding-export-setting/onboarding-export-setting.component';
import { OnboardingFieldSettingComponent } from './onboarding/onboarding-field-setting/onboarding-field-setting.component';
import { OnboardingAdvancedSettingComponent } from './onboarding/onboarding-advanced-setting/onboarding-advanced-setting.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    LandingComponent,
    ConfigurationComponent,
    DashboardComponent,
    MainComponent,
    OnboardingComponent,
    OnboardingDoneComponent,
    OnboardingExportSettingComponent,
    OnboardingFieldSettingComponent,
    OnboardingAdvancedSettingComponent
  ],
  imports: [
    CommonModule,
    QbdRoutingModule,
    SharedModule
  ]
})
export class QbdModule { }
