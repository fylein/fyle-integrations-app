import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiSelectModule } from 'primeng/multiselect';

import { QboEmployeeSettingsComponent } from './qbo-employee-settings/qbo-employee-settings.component';
import { QboExportSettingsComponent } from './qbo-export-settings/qbo-export-settings.component';
import { QboImportSettingsComponent } from './qbo-import-settings/qbo-import-settings.component';
import { QboAdvancedSettingsComponent } from './qbo-advanced-settings/qbo-advanced-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    QboEmployeeSettingsComponent,
    QboExportSettingsComponent,
    QboImportSettingsComponent,
    QboAdvancedSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule
  ],
  exports: [
    QboEmployeeSettingsComponent,
    QboExportSettingsComponent,
    QboImportSettingsComponent,
    QboAdvancedSettingsComponent
  ]
})
export class QboSharedModule { }
