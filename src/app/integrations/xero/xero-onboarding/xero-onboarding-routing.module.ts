import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroOnboardingAdvancedSettingsComponent } from './xero-onboarding-advanced-settings/xero-onboarding-advanced-settings.component';
import { XeroOnboardingConnectorComponent } from './xero-onboarding-connector/xero-onboarding-connector.component';
import { XeroOnboardingDoneComponent } from './xero-onboarding-done/xero-onboarding-done.component';
import { XeroOnboardingExportSettingsComponent } from './xero-onboarding-export-settings/xero-onboarding-export-settings.component';
import { XeroOnboardingImportSettingsComponent } from './xero-onboarding-import-settings/xero-onboarding-import-settings.component';
import { XeroOnboardingLandingComponent } from './xero-onboarding-landing/xero-onboarding-landing.component';
import { XeroOnboardingComponent } from './xero-onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: XeroOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: XeroOnboardingLandingComponent
      },
      {
        path: 'connector',
        component: XeroOnboardingConnectorComponent
      },
      { path: 'export_settings',
        component: XeroOnboardingExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: XeroOnboardingImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: XeroOnboardingAdvancedSettingsComponent
      },
      {
        path: 'done',
        component: XeroOnboardingDoneComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XeroOnboardingRoutingModule { }
