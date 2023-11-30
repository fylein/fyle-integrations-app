import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QboEmployeeSettingsComponent } from './qbo-employee-settings/qbo-employee-settings.component';
import { QboExportSettingsComponent } from './qbo-export-settings/qbo-export-settings.component';
import { QboImportSettingsComponent } from './qbo-import-settings/qbo-import-settings.component';
import { QboAdvancedSettingsComponent } from './qbo-advanced-settings/qbo-advanced-settings.component';



@NgModule({
  declarations: [
    QboEmployeeSettingsComponent,
    QboExportSettingsComponent,
    QboImportSettingsComponent,
    QboAdvancedSettingsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class QboSharedModule { }
