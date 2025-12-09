import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QboOnboardingComponent } from './qbo-onboarding.component';
import { QboOnboardingLandingComponent } from './qbo-onboarding-landing/qbo-onboarding-landing.component';
import { QboOnboardingConnectorComponent } from './qbo-onboarding-connector/qbo-onboarding-connector.component';
import { QboOnboardingExportSettingsComponent } from './qbo-onboarding-export-settings/qbo-onboarding-export-settings.component';
import { QboOnboardingImportSettingsComponent } from './qbo-onboarding-import-settings/qbo-onboarding-import-settings.component';
import { QboOnboardingAdvancedSettingsComponent } from './qbo-onboarding-advanced-settings/qbo-onboarding-advanced-settings.component';
import { QboOnboardingDoneComponent } from './qbo-onboarding-done/qbo-onboarding-done.component';
import { QboTokenGuard } from 'src/app/core/guard/qbo-token.guard';
import { QboCloneSettingsComponent } from './qbo-clone-settings/qbo-clone-settings.component';

const routes: Routes = [
  {
    path: '',
    component: QboOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: QboOnboardingLandingComponent,
      },
      {
        path: 'connector',
        component: QboOnboardingConnectorComponent,
      },
      {
        path: 'export_settings',
        component: QboOnboardingExportSettingsComponent,
        canActivate: [QboTokenGuard],
      },
      {
        path: 'import_settings',
        component: QboOnboardingImportSettingsComponent,
        canActivate: [QboTokenGuard],
      },
      {
        path: 'advanced_settings',
        component: QboOnboardingAdvancedSettingsComponent,
        canActivate: [QboTokenGuard],
      },
      {
        path: 'done',
        component: QboOnboardingDoneComponent,
        canActivate: [QboTokenGuard],
      },
      {
        path: 'clone_settings',
        component: QboCloneSettingsComponent,
        canActivate: [QboTokenGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QboOnboardingRoutingModule {}
