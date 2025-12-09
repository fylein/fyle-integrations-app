import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetsuiteOnboardingRoutingModule } from './netsuite-onboarding-routing.module';
import { NetsuiteOnboardingComponent } from './netsuite-onboarding.component';
import { NetsuiteOnboardingLandingComponent } from './netsuite-onboarding-landing/netsuite-onboarding-landing.component';
import { NetsuiteOnboardingConnectorComponent } from './netsuite-onboarding-connector/netsuite-onboarding-connector.component';
import { NetsuiteOnboardingExportSettingsComponent } from './netsuite-onboarding-export-settings/netsuite-onboarding-export-settings.component';
import { NetsuiteOnboardingImportSettingsComponent } from './netsuite-onboarding-import-settings/netsuite-onboarding-import-settings.component';
import { NetsuiteOnboardingAdvancedSettingsComponent } from './netsuite-onboarding-advanced-settings/netsuite-onboarding-advanced-settings.component';
import { NetsuiteOnboardingDoneComponent } from './netsuite-onboarding-done/netsuite-onboarding-done.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetsuiteSharedModule } from '../netsuite-shared/netsuite-shared-module';

@NgModule({
  declarations: [
    NetsuiteOnboardingComponent,
    NetsuiteOnboardingLandingComponent,
    NetsuiteOnboardingConnectorComponent,
    NetsuiteOnboardingExportSettingsComponent,
    NetsuiteOnboardingImportSettingsComponent,
    NetsuiteOnboardingAdvancedSettingsComponent,
    NetsuiteOnboardingDoneComponent,
  ],
  imports: [
    CommonModule,
    NetsuiteOnboardingRoutingModule,
    NetsuiteSharedModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class NetsuiteOnboardingModule {}
