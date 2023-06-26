import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingAdvancedSettingComponent } from '../onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingExportSettingComponent } from '../onboarding-export-setting/onboarding-export-setting.component';
import { OnboardingImportSettingComponent } from '../onboarding-import-setting/onboarding-import-setting.component';



@NgModule({
  declarations: [
    OnboardingComponent,
    OnboardingAdvancedSettingComponent,
    OnboardingExportSettingComponent,
    OnboardingImportSettingComponent
  ],
  imports: [
    CommonModule
  ]
})
export class OnboardingModule { }
