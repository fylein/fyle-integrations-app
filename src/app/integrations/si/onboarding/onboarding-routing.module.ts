import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { OnboardingExportSettingComponent } from './onboarding-export-setting/onboarding-export-setting.component';
import { OnboardingImportSettingComponent } from './onboarding-import-setting/onboarding-import-setting.component';
import { OnboardingAdvancedSettingComponent } from './onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingComponent } from './onboarding.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    children: [
      {
        path: 'landing',
        component: OnboardingLandingComponent
      },
      {
        path: 'export_settings',
        component: OnboardingExportSettingComponent
      },
      {
        path: 'import_settings',
        component: OnboardingImportSettingComponent
      },
      {
        path: 'advanced_settings',
        component: OnboardingAdvancedSettingComponent
      },
      {
        path: 'done',
        component: OnboardingDoneComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
