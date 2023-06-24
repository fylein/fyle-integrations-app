import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationsRoutingModule } from './integrations-routing.module';
import { IntegrationsComponent } from './integrations.component';
import { LandingComponent } from './landing/landing.component';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { QbdComponent } from './qbd/qbd.component';
import { SharedModule } from '../shared/shared.module';
import { OnboardingAdvancedSettingComponent } from './si/onboarding/onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingExportSettingComponent } from './si/onboarding/onboarding-export-setting/onboarding-export-setting.component';
import { OnboardingImportSettingComponent } from './si/onboarding/onboarding-import-setting/onboarding-import-setting.component';
import { OnboardingConnectToSageComponent } from './si/onboarding/onboarding-connect-to-sage/onboarding-connect-to-sage.component';
import { OnboardingLandingComponent } from './si/onboarding/onboarding-landing/onboarding-landing.component';
import { OnboardingDoneComponent } from './si/onboarding/onboarding-done/onboarding-done.component';


@NgModule({
  declarations: [
    IntegrationsComponent,
    LandingComponent,
    QbdComponent,
    OnboardingAdvancedSettingComponent,
    OnboardingExportSettingComponent,
    OnboardingImportSettingComponent,
    OnboardingConnectToSageComponent,
    OnboardingLandingComponent,
    OnboardingDoneComponent
  ],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    SharedModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class IntegrationsModule { }
