import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdAdvancedSettingComponent } from './qbd-advanced-setting/qbd-advanced-setting.component';
import { QbdExportSettingComponent } from './qbd-export-setting/qbd-export-setting.component';
import { QbdFieldMappingComponent } from './qbd-field-mapping/qbd-field-mapping.component';
import { QbdAutoOnboardingComponent } from "../qbd-onboarding/qbd-auto-onboarding/qbd-auto-onboarding.component";

@NgModule({
  declarations: [
    QbdAdvancedSettingComponent,
    QbdExportSettingComponent,
    QbdFieldMappingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    QbdAutoOnboardingComponent
],
  exports: [
    QbdAdvancedSettingComponent,
    QbdExportSettingComponent,
    QbdFieldMappingComponent
  ]
})


export class QbdSharedModule { }
