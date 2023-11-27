import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboOnboardingRoutingModule } from './qbo-onboarding-routing.module';
import { QboOnboardingComponent } from './qbo-onboarding.component';
import { QboOnboardingLandingComponent } from './qbo-onboarding-landing/qbo-onboarding-landing.component';
import { QboOnboardingConnectorComponent } from './qbo-onboarding-connector/qbo-onboarding-connector.component';
import { QboOnboardingEmployeeSettingsComponent } from './qbo-onboarding-employee-settings/qbo-onboarding-employee-settings.component';
import { QboOnboardingExportSettingsComponent } from './qbo-onboarding-export-settings/qbo-onboarding-export-settings.component';
import { QboOnboardingImportSettingsComponent } from './qbo-onboarding-import-settings/qbo-onboarding-import-settings.component';
import { QboOnboardingAdvancedSettingsComponent } from './qbo-onboarding-advanced-settings/qbo-onboarding-advanced-settings.component';
import { QboOnboardingDoneComponent } from './qbo-onboarding-done/qbo-onboarding-done.component';


@NgModule({
  declarations: [
    QboOnboardingComponent,
    QboOnboardingLandingComponent,
    QboOnboardingConnectorComponent,
    QboOnboardingEmployeeSettingsComponent,
    QboOnboardingExportSettingsComponent,
    QboOnboardingImportSettingsComponent,
    QboOnboardingAdvancedSettingsComponent,
    QboOnboardingDoneComponent
  ],
  imports: [
    CommonModule,
    QboOnboardingRoutingModule
  ]
})
export class QboOnboardingModule { }
