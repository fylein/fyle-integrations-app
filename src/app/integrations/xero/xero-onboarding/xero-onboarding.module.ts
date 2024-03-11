import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XeroOnboardingRoutingModule } from './xero-onboarding-routing.module';
import { XeroOnboardingComponent } from './xero-onboarding.component';
import { XeroOnboardingLandingComponent } from './xero-onboarding-landing/xero-onboarding-landing.component';
import { XeroOnboardingConnectorComponent } from './xero-onboarding-connector/xero-onboarding-connector.component';
import { XeroOnboardingExportSettingsComponent } from './xero-onboarding-export-settings/xero-onboarding-export-settings.component';
import { XeroOnboardingImportSettingsComponent } from './xero-onboarding-import-settings/xero-onboarding-import-settings.component';
import { XeroOnboardingAdvancedSettingsComponent } from './xero-onboarding-advanced-settings/xero-onboarding-advanced-settings.component';
import { XeroOnboardingDoneComponent } from './xero-onboarding-done/xero-onboarding-done.component';
import { XeroSharedModule } from '../xero-shared/xero-shared.module';


@NgModule({
  declarations: [
    XeroOnboardingComponent,
    XeroOnboardingLandingComponent,
    XeroOnboardingConnectorComponent,
    XeroOnboardingExportSettingsComponent,
    XeroOnboardingImportSettingsComponent,
    XeroOnboardingAdvancedSettingsComponent,
    XeroOnboardingDoneComponent
  ],
  imports: [
    CommonModule,
    XeroSharedModule,
    XeroOnboardingRoutingModule
  ]
})
export class XeroOnboardingModule { }
