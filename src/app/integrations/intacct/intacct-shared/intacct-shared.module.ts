import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntacctExportSettingsComponent } from './intacct-export-settings/intacct-export-settings.component';
import { IntacctImportSettingsComponent } from './intacct-import-settings/intacct-import-settings.component';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { IntacctAdvancedSettingsComponent } from './intacct-advanced-settings/intacct-advanced-settings.component';
import { IntacctC1ImportSettingsComponent } from './intacct-c1-import-settings/intacct-c1-import-settings.component';

@NgModule({
  declarations: [
    IntacctExportSettingsComponent,
    IntacctImportSettingsComponent,
    IntacctAdvancedSettingsComponent,
    IntacctC1ImportSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    TooltipModule,
    DialogModule,
    InputSwitchModule
  ],
  exports: [
    IntacctExportSettingsComponent,
    IntacctImportSettingsComponent,
    IntacctAdvancedSettingsComponent
  ]
})
export class IntacctSharedModule { }
