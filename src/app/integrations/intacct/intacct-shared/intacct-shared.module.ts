import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntacctExportSettingsComponent } from './intacct-export-settings/intacct-export-settings.component';
import { IntacctImportSettingsComponent } from './intacct-import-settings/intacct-import-settings.component';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
@NgModule({
  declarations: [
    IntacctExportSettingsComponent,
    IntacctImportSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    TooltipModule,
    DialogModule
  ],
  exports: [
    IntacctExportSettingsComponent,
    IntacctImportSettingsComponent
  ]
})
export class IntacctSharedModule { }
