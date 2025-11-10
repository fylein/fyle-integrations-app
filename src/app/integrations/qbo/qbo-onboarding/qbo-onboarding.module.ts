import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { IconSpriteModule } from 'ng-svg-icon-sprite';

import { QboOnboardingRoutingModule } from './qbo-onboarding-routing.module';
import { QboOnboardingComponent } from './qbo-onboarding.component';
import { QboOnboardingLandingComponent } from './qbo-onboarding-landing/qbo-onboarding-landing.component';
import { QboOnboardingConnectorComponent } from './qbo-onboarding-connector/qbo-onboarding-connector.component';
import { QboOnboardingExportSettingsComponent } from './qbo-onboarding-export-settings/qbo-onboarding-export-settings.component';
import { QboOnboardingImportSettingsComponent } from './qbo-onboarding-import-settings/qbo-onboarding-import-settings.component';
import { QboOnboardingAdvancedSettingsComponent } from './qbo-onboarding-advanced-settings/qbo-onboarding-advanced-settings.component';
import { QboOnboardingDoneComponent } from './qbo-onboarding-done/qbo-onboarding-done.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QboSharedModule } from '../qbo-shared/qbo-shared.module';
import { QboCloneSettingsComponent } from './qbo-clone-settings/qbo-clone-settings.component';

@NgModule({
  declarations: [
    QboOnboardingComponent,
    QboOnboardingLandingComponent,
    QboOnboardingConnectorComponent,
    QboOnboardingExportSettingsComponent,
    QboOnboardingImportSettingsComponent,
    QboOnboardingAdvancedSettingsComponent,
    QboOnboardingDoneComponent,
    QboCloneSettingsComponent
  ],
  imports: [
    CommonModule,
    QboOnboardingRoutingModule,
    SharedModule,
    QboSharedModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    TooltipModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class QboOnboardingModule { }
