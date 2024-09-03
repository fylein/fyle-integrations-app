import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnboardingRoutingModule } from './qbd-onboarding-routing.module';
import { QbdOnboardingDoneComponent } from './qbd-onboarding-done/qbd-onboarding-done.component';
import { QbdOnboardingExportSettingComponent } from './qbd-onboarding-export-setting/qbd-onboarding-export-setting.component';
import { QbdOnboardingFieldSettingComponent } from './qbd-onboarding-field-setting/qbd-onboarding-field-setting.component';
import { QbdOnboardingAdvancedSettingComponent } from './qbd-onboarding-advanced-setting/qbd-onboarding-advanced-setting.component';
import { QbdLandingComponent } from './qbd-onboarding-landing/qbd-landing.component';
import { QbdSharedModule } from '../qbd-shared/qbd-shared.module';
import { QbdAutoOnboardingComponent } from "./qbd-auto-onboarding/qbd-auto-onboarding.component";


@NgModule({
  declarations: [
    QbdOnboardingDoneComponent,
    QbdOnboardingExportSettingComponent,
    QbdOnboardingFieldSettingComponent,
    QbdOnboardingAdvancedSettingComponent,
    QbdLandingComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    SharedModule,
    QbdSharedModule,
    QbdAutoOnboardingComponent,
    QbdAutoOnboardingComponent
]
})
export class QbdOnboardingModule { }
