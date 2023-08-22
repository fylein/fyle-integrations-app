import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnboardingIntacctConnectorComponent } from './onboarding-intacct-connector/onboarding-intacct-connector.component';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { OnboardingComponent } from './onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationComponent } from '../main/configuration/configuration.component';
import { DashboardComponent } from '../main/dashboard/dashboard.component';
import { MainComponent } from '../main/main.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingExportSettingComponent } from './onboarding-export-setting/onboarding-export-setting.component';
import { OnboardingAdvancedSettingComponent } from './onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingImportSettingComponent } from './onboarding-import-setting/onboarding-import-setting.component';

@NgModule({
  declarations: [
    OnboardingIntacctConnectorComponent,
    OnboardingLandingComponent,
    OnboardingComponent,
    ConfigurationComponent,
    DashboardComponent,
    MainComponent,
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
