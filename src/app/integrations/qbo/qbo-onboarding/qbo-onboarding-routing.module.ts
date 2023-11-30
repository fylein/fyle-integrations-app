import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QboOnboardingComponent } from './qbo-onboarding.component';
import { QboOnboardingLandingComponent } from './qbo-onboarding-landing/qbo-onboarding-landing.component';
import { QboOnboardingConnectorComponent } from './qbo-onboarding-connector/qbo-onboarding-connector.component';
import { QboOnboardingEmployeeSettingsComponent } from './qbo-onboarding-employee-settings/qbo-onboarding-employee-settings.component';
import { QboOnboardingExportSettingsComponent } from './qbo-onboarding-export-settings/qbo-onboarding-export-settings.component';
import { QboOnboardingImportSettingsComponent } from './qbo-onboarding-import-settings/qbo-onboarding-import-settings.component';
import { QboOnboardingAdvancedSettingsComponent } from './qbo-onboarding-advanced-settings/qbo-onboarding-advanced-settings.component';
import { QboOnboardingDoneComponent } from './qbo-onboarding-done/qbo-onboarding-done.component';

const routes: Routes = [
  {
    path: '',
    component: QboOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: QboOnboardingLandingComponent
      },
      {
        path: 'connector',
        component: QboOnboardingConnectorComponent
      },
      {
        path: 'employee_settings',
        component: QboOnboardingEmployeeSettingsComponent
      },
      {
        path: 'export_settings',
        component: QboOnboardingExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: QboOnboardingImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: QboOnboardingAdvancedSettingsComponent
      },
      {
        path: 'done',
        component: QboOnboardingDoneComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboOnboardingRoutingModule { }
