import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbdDirectOnboardingAdvancedSettingsComponent } from './qbd-direct-onboarding-advanced-settings/qbd-direct-onboarding-advanced-settings.component';
import { QbdDirectOnboardingConnectorComponent } from './qbd-direct-onboarding-connector/qbd-direct-onboarding-connector.component';
import { QbdDirectOnboardingDoneComponent } from './qbd-direct-onboarding-done/qbd-direct-onboarding-done.component';
import { QbdDirectOnboardingExportSettingsComponent } from './qbd-direct-onboarding-export-settings/qbd-direct-onboarding-export-settings.component';
import { QbdDirectOnboardingImportSettingsComponent } from './qbd-direct-onboarding-import-settings/qbd-direct-onboarding-import-settings.component';
import { QbdDirectOnboardingLandingComponent } from './qbd-direct-onboarding-landing/qbd-direct-onboarding-landing.component';
import { QbdDirectOnboardingComponent } from './qbd-direct-onboarding.component';
import { QbdDirectOnboardingPreRequisiteComponent } from './qbd-direct-onboarding-pre-requisite/qbd-direct-onboarding-pre-requisite.component';

const routes: Routes = [
  {
    path: '',
    component: QbdDirectOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: QbdDirectOnboardingLandingComponent,
      },
      {
        path: 'pre_requisite',
        component: QbdDirectOnboardingPreRequisiteComponent,
      },
      {
        path: 'connector',
        component: QbdDirectOnboardingConnectorComponent,
      },
      {
        path: 'export_settings',
        component: QbdDirectOnboardingExportSettingsComponent,
      },
      {
        path: 'import_settings',
        component: QbdDirectOnboardingImportSettingsComponent,
      },
      {
        path: 'advanced_settings',
        component: QbdDirectOnboardingAdvancedSettingsComponent,
      },
      {
        path: 'done',
        component: QbdDirectOnboardingDoneComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QbdDirectOnboardingRoutingModule {}
