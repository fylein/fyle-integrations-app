import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiSelectModule } from 'primeng/multiselect';

import { QboExportSettingsComponent } from './qbo-export-settings/qbo-export-settings.component';
import { QboImportSettingsComponent } from './qbo-import-settings/qbo-import-settings.component';
import { QboAdvancedSettingsComponent } from './qbo-advanced-settings/qbo-advanced-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
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
    QboExportSettingsComponent,
    QboImportSettingsComponent,
    QboAdvancedSettingsComponent
  ]
})
export class QboSharedModule { }
