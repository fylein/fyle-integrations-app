import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { QbdOnboardingAdvancedSettingComponent } from './qbd-onboarding-advanced-setting/qbd-onboarding-advanced-setting.component';
import { QbdOnboardingDoneComponent } from './qbd-onboarding-done/qbd-onboarding-done.component';
import { QbdOnboardingExportSettingComponent } from './qbd-onboarding-export-setting/qbd-onboarding-export-setting.component';
import { QbdOnboardingFieldSettingComponent } from './qbd-onboarding-field-setting/qbd-onboarding-field-setting.component';
import { QbdLandingComponent } from './qbd-onboarding-landing/qbd-landing.component';
import { QbdOnboardingComponent } from './qbd-onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: QbdOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: QbdLandingComponent
      },
      {
        path: 'export_settings',
        component: QbdOnboardingExportSettingComponent
      },
      {
        path: 'field_mappings',
        component: QbdOnboardingFieldSettingComponent
      },
      {
        path: 'advanced_settings',
        component: QbdOnboardingAdvancedSettingComponent
      },
      {
        path: 'done',
        component: QbdOnboardingDoneComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
