import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sage300OnboardingComponent } from './sage300-onboarding.component';
import { Sage300OnboardingLandingComponent } from './sage300-onboarding-landing/sage300-onboarding-landing.component';
import { Sage300OnboardingExportSettingsComponent } from './sage300-onboarding-export-settings/sage300-onboarding-export-settings.component';
import { Sage300OnboardingConnectorComponent } from './sage300-onboarding-connector/sage300-onboarding-connector.component';
import { Sage300OnboardingDoneComponent } from './sage300-onboarding-done/sage300-onboarding-done.component';
import { Sage300OnboardingImportSettingsComponent } from './sage300-onboarding-import-settings/sage300-onboarding-import-settings.component';
import { Sage300OnboardingAdvancedSettingsComponent } from './sage300-onboarding-advanced-settings/sage300-onboarding-advanced-settings.component';

const routes: Routes = [
  {
    path: '',
    component: Sage300OnboardingComponent,
    children: [
      {
        path: 'landing',
        component: Sage300OnboardingLandingComponent,
      },
      {
        path: 'connector',
        component: Sage300OnboardingConnectorComponent,
      },
      { path: 'export_settings', component: Sage300OnboardingExportSettingsComponent },
      {
        path: 'import_settings',
        component: Sage300OnboardingImportSettingsComponent,
      },
      {
        path: 'advanced_settings',
        component: Sage300OnboardingAdvancedSettingsComponent,
      },
      {
        path: 'done',
        component: Sage300OnboardingDoneComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Sage300OnboardingRoutingModule {}
