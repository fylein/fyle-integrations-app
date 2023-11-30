import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessCentralOnboardingComponent } from './business-central-onboarding.component';
import { BusinessCentralOnboardingLandingComponent } from './business-central-onboarding-landing/business-central-onboarding-landing.component';
import { BusinessCentralOnboardingConnectorComponent } from './business-central-onboarding-connector/business-central-onboarding-connector.component';
import { BusinessCentralOnboardingExportSettingsComponent } from './business-central-onboarding-export-settings/business-central-onboarding-export-settings.component';
import { BusinessCentralOnboardingImportSettingsComponent } from './business-central-onboarding-import-settings/business-central-onboarding-import-settings.component';
import { BusinessCentralOnboardingDoneComponent } from './business-central-onboarding-done/business-central-onboarding-done.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessCentralOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: BusinessCentralOnboardingLandingComponent
      },
      {
        path: 'connector',
        component: BusinessCentralOnboardingConnectorComponent
      },
      {
        path: 'export_settings',
        component: BusinessCentralOnboardingExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: BusinessCentralOnboardingImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: BusinessCentralOnboardingImportSettingsComponent
      },
      {
        path: 'done',
        component: BusinessCentralOnboardingDoneComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessCentralOnboardingRoutingModule { }
