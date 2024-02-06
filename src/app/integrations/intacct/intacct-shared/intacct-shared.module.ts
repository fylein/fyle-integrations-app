import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntacctExportSettingsComponent } from './intacct-export-settings/intacct-export-settings.component';
import { IntacctImportSettingsComponent } from './intacct-import-settings/intacct-import-settings.component';
import { IntacctAdvancedSettingsComponent } from './intacct-advanced-settings/intacct-advanced-settings.component';

@NgModule({
  declarations: [
    IntacctExportSettingsComponent,
    IntacctImportSettingsComponent,
    IntacctAdvancedSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule
  ],
  exports: [
    IntacctExportSettingsComponent,
    IntacctImportSettingsComponent,
    IntacctAdvancedSettingsComponent
  ]
})
export class IntacctSharedModule { }
