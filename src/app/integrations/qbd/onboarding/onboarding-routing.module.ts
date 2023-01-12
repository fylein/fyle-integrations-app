import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingAdvancedSettingComponent } from './onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingExportSettingComponent } from './onboarding-export-setting/onboarding-export-setting.component';
import { OnboardingFieldSettingComponent } from './onboarding-field-setting/onboarding-field-setting.component';
import { LandingComponent } from './onboarding-landing/landing.component';
import { OnboardingComponent } from './onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    children: [
      {
        path: 'landing',
        component: LandingComponent
        // CanActivate: [WorkspacesGuard]
      },
      {
        path: 'export_settings',
        component: OnboardingExportSettingComponent
        // CanActivate: [WorkspacesGuard]
      },
      {
        path: 'field_mappings',
        component: OnboardingFieldSettingComponent
        // CanActivate: [WorkspacesGuard]
      },
      {
        path: 'advanced_settings',
        component: OnboardingAdvancedSettingComponent
        // CanActivate: [WorkspacesGuard]
      },
      {
        path: 'done',
        component: OnboardingDoneComponent
        // CanActivate: [WorkspacesGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
