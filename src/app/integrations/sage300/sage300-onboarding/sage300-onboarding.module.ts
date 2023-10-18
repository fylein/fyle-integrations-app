import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300OnboardingLandingComponent } from './sage300-onboarding-landing/sage300-onboarding-landing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage300OnboardingRoutingModule } from './sage300-onboarding-routing.module';
import { Sage300OnboardingExportSettingsComponent } from './sage300-onboarding-export-settings/sage300-onboarding-export-settings.component';



@NgModule({
  declarations: [
    Sage300OnboardingLandingComponent,
    Sage300OnboardingExportSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Sage300OnboardingRoutingModule
  ]
})
export class Sage300OnboardingModule { }
