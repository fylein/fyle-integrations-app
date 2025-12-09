import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessCentralOnboardingRoutingModule } from './business-central-onboarding-routing.module';
import { BusinessCentralOnboardingAdvancedSettingsComponent } from './business-central-onboarding-advanced-settings/business-central-onboarding-advanced-settings.component';
import { BusinessCentralOnboardingConnectorComponent } from './business-central-onboarding-connector/business-central-onboarding-connector.component';
import { BusinessCentralOnboardingLandingComponent } from './business-central-onboarding-landing/business-central-onboarding-landing.component';
import { BusinessCentralOnboardingExportSettingsComponent } from './business-central-onboarding-export-settings/business-central-onboarding-export-settings.component';
import { BusinessCentralOnboardingImportSettingsComponent } from './business-central-onboarding-import-settings/business-central-onboarding-import-settings.component';
import { BusinessCentralOnboardingComponent } from './business-central-onboarding.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BusinessCentralSharedModule } from '../business-central-shared/business-central-shared.module';
import { BusinessCentralOnboardingDoneComponent } from './business-central-onboarding-done/business-central-onboarding-done.component';

@NgModule({
  declarations: [
    BusinessCentralOnboardingLandingComponent,
    BusinessCentralOnboardingConnectorComponent,
    BusinessCentralOnboardingExportSettingsComponent,
    BusinessCentralOnboardingImportSettingsComponent,
    BusinessCentralOnboardingAdvancedSettingsComponent,
    BusinessCentralOnboardingDoneComponent,
    BusinessCentralOnboardingComponent,
  ],
  imports: [CommonModule, BusinessCentralOnboardingRoutingModule, SharedModule, BusinessCentralSharedModule],
})
export class BusinessCentralOnboardingModule {}
