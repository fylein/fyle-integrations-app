
import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NetsuiteOnboardingComponent } from './netsuite-onboarding.component';
import { NetsuiteOnboardingLandingComponent } from './netsuite-onboarding-landing/netsuite-onboarding-landing.component';
import { NetsuiteOnboardingConnectorComponent } from './netsuite-onboarding-connector/netsuite-onboarding-connector.component';
import { NetsuiteOnboardingExportSettingsComponent } from './netsuite-onboarding-export-settings/netsuite-onboarding-export-settings.component';
import { NetsuiteOnboardingImportSettingsComponent } from './netsuite-onboarding-import-settings/netsuite-onboarding-import-settings.component';
import { NetsuiteOnboardingAdvancedSettingsComponent } from './netsuite-onboarding-advanced-settings/netsuite-onboarding-advanced-settings.component';
import { NetsuiteOnboardingDoneComponent } from './netsuite-onboarding-done/netsuite-onboarding-done.component';

const routes: Routes = [
  {
    path: '',
    component: NetsuiteOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: NetsuiteOnboardingLandingComponent
      },
      {
        path: 'connector',
        component: NetsuiteOnboardingConnectorComponent
      },
      {
        path: 'export_settings',
        component: NetsuiteOnboardingExportSettingsComponent
      },
      {
        path: 'import_settings',
        component: NetsuiteOnboardingImportSettingsComponent
      },
      {
        path: 'advanced_settings',
        component: NetsuiteOnboardingAdvancedSettingsComponent
      },
      {
        path: 'done',
        component: NetsuiteOnboardingDoneComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetsuiteOnboardingRoutingModule { }