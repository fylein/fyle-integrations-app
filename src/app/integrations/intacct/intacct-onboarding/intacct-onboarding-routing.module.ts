import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntacctOnboardingLandingComponent } from './intacct-onboarding-landing/intacct-onboarding-landing.component';
import { IntacctOnboardingExportSettingComponent } from './intacct-onboarding-export-setting/intacct-onboarding-export-setting.component';
import { IntacctOnboardingImportSettingComponent } from './intacct-onboarding-import-setting/intacct-onboarding-import-setting.component';
import { OnboardingAdvancedSettingComponent } from './onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { IntacctOnboardingComponent } from './intacct-onboarding.component';
import { RouterModule, Routes } from '@angular/router';
import { IntacctOnboardingConnectorComponent } from './intacct-onboarding-connector/intacct-onboarding-connector.component';


const routes: Routes = [
  {
    path: '',
    component: IntacctOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: IntacctOnboardingLandingComponent
      },
      {
        path: 'connector',
        component: IntacctOnboardingConnectorComponent
      },
      {
        path: 'export_settings',
        component: IntacctOnboardingExportSettingComponent
      },
      {
        path: 'import_settings',
        component: IntacctOnboardingImportSettingComponent
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
