import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingExportSettingComponent } from './onboarding-export-setting/onboarding-export-setting.component';
import { OnboardingFieldSettingComponent } from './onboarding-field-setting/onboarding-field-setting.component';
import { OnboardingAdvancedSettingComponent } from './onboarding-advanced-setting/onboarding-advanced-setting.component';
import { LandingComponent } from './onboarding-landing/landing.component';
import { QbdSharedModule } from '../qbd-shared/qbd-shared.module';


@NgModule({
  declarations: [
    OnboardingDoneComponent,
    OnboardingExportSettingComponent,
    OnboardingFieldSettingComponent,
    OnboardingAdvancedSettingComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    SharedModule,
    QbdSharedModule
  ]
})
export class OnboardingModule { }
