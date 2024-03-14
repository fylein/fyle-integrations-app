import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XeroAdvancedSettingsComponent } from './xero-advanced-settings/xero-advanced-settings.component';
import { XeroExportSettingsComponent } from './xero-export-settings/xero-export-settings.component';
import { XeroImportSettingsComponent } from './xero-import-settings/xero-import-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    XeroExportSettingsComponent,
    XeroImportSettingsComponent,
    XeroAdvancedSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    XeroExportSettingsComponent,
    XeroImportSettingsComponent,
    XeroAdvancedSettingsComponent
  ]
})
export class XeroSharedModule { }
