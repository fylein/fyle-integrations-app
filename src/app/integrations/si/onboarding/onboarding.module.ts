import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingAdvancedSettingComponent } from './onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingExportSettingComponent } from './onboarding-export-setting/onboarding-export-setting.component';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingImportSettingComponent } from './onboarding-import-setting/onboarding-import-setting.component';


@NgModule({
  declarations: [
    OnboardingComponent,
    OnboardingAdvancedSettingComponent,
    OnboardingExportSettingComponent,
    OnboardingLandingComponent,
    OnboardingDoneComponent,
    OnboardingImportSettingComponent
  ],
  imports: [
    CommonModule
  ]
})
export class OnboardingModule { }
