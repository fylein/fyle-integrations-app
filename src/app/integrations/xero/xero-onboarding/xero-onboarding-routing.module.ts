import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroOnboardingAdvancedSettingsComponent } from './xero-onboarding-advanced-settings/xero-onboarding-advanced-settings.component';
import { XeroOnboardingConnectorComponent } from './xero-onboarding-connector/xero-onboarding-connector.component';
import { XeroOnboardingDoneComponent } from './xero-onboarding-done/xero-onboarding-done.component';
import { XeroOnboardingExportSettingsComponent } from './xero-onboarding-export-settings/xero-onboarding-export-settings.component';
import { XeroOnboardingImportSettingsComponent } from './xero-onboarding-import-settings/xero-onboarding-import-settings.component';
import { XeroOnboardingLandingComponent } from './xero-onboarding-landing/xero-onboarding-landing.component';
import { XeroOnboardingComponent } from './xero-onboarding.component';
import { XeroTokenGuard } from 'src/app/core/guard/xero-token.guard';
import { TenantGuard } from 'src/app/core/guard/tenant.guard';
import { XeroCloneSettingsComponent } from './xero-clone-settings/xero-clone-settings.component';

const routes: Routes = [
  {
    path: '',
    component: XeroOnboardingComponent,
    children: [
      {
        path: 'landing',
        component: XeroOnboardingLandingComponent,
      },
      {
        path: 'connector',
        component: XeroOnboardingConnectorComponent,
      },
      {
        path: 'export_settings',
        component: XeroOnboardingExportSettingsComponent,
        canActivate: [XeroTokenGuard, TenantGuard],
      },
      {
        path: 'import_settings',
        component: XeroOnboardingImportSettingsComponent,
        canActivate: [XeroTokenGuard],
      },
      {
        path: 'advanced_settings',
        component: XeroOnboardingAdvancedSettingsComponent,
        canActivate: [XeroTokenGuard],
      },
      {
        path: 'done',
        component: XeroOnboardingDoneComponent,
        canActivate: [XeroTokenGuard],
      },
      {
        path: 'clone_settings',
        component: XeroCloneSettingsComponent,
        canActivate: [XeroTokenGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XeroOnboardingRoutingModule {}
