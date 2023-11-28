import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessCentralOnboardingRoutingModule } from './business-central-onboarding-routing.module';
import { BusinessCentralOnboardingAdvancedSettingsComponent } from './business-central-onboarding-advanced-settings/business-central-onboarding-advanced-settings.component';
import { BusinessCentralOnboardingConnectorComponent } from './business-central-onboarding-connector/business-central-onboarding-connector.component';
import { BusinessCentralOnboardingLandingComponent } from './business-central-onboarding-landing/business-central-onboarding-landing.component';
import { BusinessCentralOnboardingExportSettingsComponent } from './business-central-onboarding-export-settings/business-central-onboarding-export-settings.component';
import { BusinessCentralOnboardingImportSettingsComponent } from './business-central-onboarding-import-settings/business-central-onboarding-import-settings.component';


@NgModule({
  declarations: [
    BusinessCentralOnboardingLandingComponent,
    BusinessCentralOnboardingConnectorComponent,
    BusinessCentralOnboardingExportSettingsComponent,
    BusinessCentralOnboardingImportSettingsComponent,
    BusinessCentralOnboardingAdvancedSettingsComponent
  ],
  imports: [
    CommonModule,
    BusinessCentralOnboardingRoutingModule
  ]
})
export class BusinessCentralOnboardingModule { }
