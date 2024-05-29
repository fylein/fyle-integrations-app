import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300OnboardingLandingComponent } from './sage300-onboarding-landing/sage300-onboarding-landing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage300OnboardingRoutingModule } from './sage300-onboarding-routing.module';
import { Sage300OnboardingExportSettingsComponent } from './sage300-onboarding-export-settings/sage300-onboarding-export-settings.component';
import { Sage300SharedModule } from '../sage300-shared/sage300-shared.module';
import { Sage300OnboardingConnectorComponent } from './sage300-onboarding-connector/sage300-onboarding-connector.component';
import { Sage300OnboardingDoneComponent } from './sage300-onboarding-done/sage300-onboarding-done.component';
import { Sage300OnboardingImportSettingsComponent } from './sage300-onboarding-import-settings/sage300-onboarding-import-settings.component';
import { Sage300OnboardingAdvancedSettingsComponent } from './sage300-onboarding-advanced-settings/sage300-onboarding-advanced-settings.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    Sage300OnboardingLandingComponent,
    Sage300OnboardingConnectorComponent,
    Sage300OnboardingExportSettingsComponent,
    Sage300OnboardingImportSettingsComponent,
    Sage300OnboardingAdvancedSettingsComponent,
    Sage300OnboardingDoneComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Sage300SharedModule,
    Sage300OnboardingRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    Sage300OnboardingExportSettingsComponent,
    Sage300OnboardingImportSettingsComponent,
    Sage300OnboardingAdvancedSettingsComponent
  ]
})
export class Sage300OnboardingModule { }
