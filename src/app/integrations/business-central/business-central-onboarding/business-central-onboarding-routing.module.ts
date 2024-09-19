import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BusinessCentralOnboardingComponent } from './business-central-onboarding.component';
import { BusinessCentralOnboardingLandingComponent } from './business-central-onboarding-landing/business-central-onboarding-landing.component';
import { BusinessCentralOnboardingConnectorComponent } from './business-central-onboarding-connector/business-central-onboarding-connector.component';
import { BusinessCentralOnboardingExportSettingsComponent } from './business-central-onboarding-export-settings/business-central-onboarding-export-settings.component';
import { BusinessCentralOnboardingImportSettingsComponent } from './business-central-onboarding-import-settings/business-central-onboarding-import-settings.component';
import { BusinessCentralOnboardingDoneComponent } from './business-central-onboarding-done/business-central-onboarding-done.component';
import { BusinessCentralOnboardingAdvancedSettingsComponent } from './business-central-onboarding-advanced-settings/business-central-onboarding-advanced-settings.component';
import { BusinessCentralTokenGuard } from 'src/app/core/guard/business-central-token.guard';

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
        component: BusinessCentralOnboardingExportSettingsComponent,
        canActivate: [BusinessCentralTokenGuard]
      },
      {
        path: 'import_settings',
        component: BusinessCentralOnboardingImportSettingsComponent,
        canActivate: [BusinessCentralTokenGuard]
      },
      {
        path: 'advanced_settings',
        component: BusinessCentralOnboardingAdvancedSettingsComponent,
        canActivate: [BusinessCentralTokenGuard]
      },
      {
        path: 'done',
        component: BusinessCentralOnboardingDoneComponent,
        canActivate: [BusinessCentralTokenGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessCentralOnboardingRoutingModule { }
