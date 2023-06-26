import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingAdvancedSettingComponent } from '../onboarding-advanced-setting/onboarding-advanced-setting.component';



@NgModule({
  declarations: [
    OnboardingComponent,
    OnboardingAdvancedSettingComponent
  ],
  imports: [
    CommonModule
  ]
})
export class OnboardingModule { }
