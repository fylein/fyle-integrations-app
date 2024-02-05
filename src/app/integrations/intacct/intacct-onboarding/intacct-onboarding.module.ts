import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingRoutingModule } from './intacct-onboarding-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntacctOnboardingConnectorComponent } from './intacct-onboarding-connector/intacct-onboarding-connector.component';
import { IntacctOnboardingLandingComponent } from './intacct-onboarding-landing/intacct-onboarding-landing.component';
import { IntacctOnboardingComponent } from './intacct-onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { IntacctOnboardingExportSettingComponent } from './intacct-onboarding-export-setting/intacct-onboarding-export-setting.component';
import { OnboardingAdvancedSettingComponent } from './onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingImportSettingComponent } from './onboarding-import-setting/onboarding-import-setting.component';
import { IntacctSharedModule } from '../intacct-shared/intacct-shared.module';

@NgModule({
  declarations: [
    IntacctOnboardingConnectorComponent,
    IntacctOnboardingLandingComponent,
    IntacctOnboardingComponent,
    OnboardingDoneComponent,
    OnboardingImportSettingComponent,
    IntacctOnboardingExportSettingComponent,
    OnboardingAdvancedSettingComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    SharedModule,
    IntacctSharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OnboardingModule { }
