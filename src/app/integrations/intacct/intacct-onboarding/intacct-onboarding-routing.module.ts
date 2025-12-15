import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntacctOnboardingLandingComponent } from './intacct-onboarding-landing/intacct-onboarding-landing.component';
import { IntacctOnboardingExportSettingComponent } from './intacct-onboarding-export-setting/intacct-onboarding-export-setting.component';
import { IntacctOnboardingImportSettingComponent } from './intacct-onboarding-import-setting/intacct-onboarding-import-setting.component';
import { IntacctOnboardingAdvancedSettingComponent } from './intacct-onboarding-advanced-setting/intacct-onboarding-advanced-setting.component';
import { IntacctOnboardingDoneComponent } from './intacct-onboarding-done/intacct-onboarding-done.component';
import { IntacctOnboardingComponent } from './intacct-onboarding.component';
import { RouterModule, Routes } from '@angular/router';
import { IntacctOnboardingConnectorComponent } from './intacct-onboarding-connector/intacct-onboarding-connector.component';
import { IntacctTokenGuard } from 'src/app/core/guard/intacct-token.guard';


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
        component: IntacctOnboardingExportSettingComponent,
        canActivate: [IntacctTokenGuard]
      },
      {
        path: 'import_settings',
        component: IntacctOnboardingImportSettingComponent,
        canActivate: [IntacctTokenGuard]
      },
      {
        path: 'advanced_settings',
        component: IntacctOnboardingAdvancedSettingComponent,
        canActivate: [IntacctTokenGuard]
      },
      {
        path: 'done',
        component: IntacctOnboardingDoneComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
