import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnboardingIntacctConnectorComponent } from './onboarding-intacct-connector/onboarding-intacct-connector.component';
import { IntacctOnboardingLandingComponent } from './intacct-onboarding-landing/intacct-onboarding-landing.component';
import { OnboardingComponent } from './onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingExportSettingComponent } from './onboarding-export-setting/onboarding-export-setting.component';
import { OnboardingAdvancedSettingComponent } from './onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingImportSettingComponent } from './onboarding-import-setting/onboarding-import-setting.component';

@NgModule({
  declarations: [
    OnboardingIntacctConnectorComponent,
    IntacctOnboardingLandingComponent,
    OnboardingComponent,
    OnboardingComponent,
    OnboardingDoneComponent,
    OnboardingImportSettingComponent,
    OnboardingExportSettingComponent,
    OnboardingAdvancedSettingComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OnboardingModule { }
