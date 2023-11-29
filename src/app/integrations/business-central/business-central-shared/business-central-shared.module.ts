import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessCentralAdvancedSettingsComponent } from './business-central-advanced-settings/business-central-advanced-settings.component';
import { BusinessCentralExportSettingsComponent } from './business-central-export-settings/business-central-export-settings.component';
import { BusinessCentralImportSettingsComponent } from './business-central-import-settings/business-central-import-settings.component';

@NgModule({
  declarations: [
    BusinessCentralExportSettingsComponent,
    BusinessCentralImportSettingsComponent,
    BusinessCentralAdvancedSettingsComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BusinessCentralExportSettingsComponent,
    BusinessCentralImportSettingsComponent,
    BusinessCentralAdvancedSettingsComponent,
  ]
})
export class BusinessCentralSharedModule { }
