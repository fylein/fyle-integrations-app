import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingRoutingModule } from './intacct-onboarding-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntacctOnboardingConnectorComponent } from './intacct-onboarding-connector/intacct-onboarding-connector.component';
import { IntacctOnboardingLandingComponent } from './intacct-onboarding-landing/intacct-onboarding-landing.component';
import { IntacctOnboardingComponent } from './intacct-onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntacctOnboardingDoneComponent } from './intacct-onboarding-done/intacct-onboarding-done.component';
import { IntacctOnboardingExportSettingComponent } from './intacct-onboarding-export-setting/intacct-onboarding-export-setting.component';

import { IntacctSharedModule } from '../intacct-shared/intacct-shared.module';
import { IntacctOnboardingImportSettingComponent } from './intacct-onboarding-import-setting/intacct-onboarding-import-setting.component';
import { IntacctOnboardingAdvancedSettingComponent } from './intacct-onboarding-advanced-setting/intacct-onboarding-advanced-setting.component';

@NgModule({
  declarations: [
    IntacctOnboardingConnectorComponent,
    IntacctOnboardingLandingComponent,
    IntacctOnboardingComponent,
    IntacctOnboardingComponent,
    IntacctOnboardingDoneComponent,
    IntacctOnboardingImportSettingComponent,
    IntacctOnboardingExportSettingComponent,
    IntacctOnboardingAdvancedSettingComponent,
  ],
  imports: [CommonModule, OnboardingRoutingModule, SharedModule, IntacctSharedModule, FormsModule, ReactiveFormsModule],
})
export class IntacctOnboardingModule {}
