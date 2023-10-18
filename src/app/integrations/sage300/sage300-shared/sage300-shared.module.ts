import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300ExportSettingsComponent } from './sage300-export-settings/sage300-export-settings.component';



@NgModule({
  declarations: [
    Sage300ExportSettingsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Sage300ExportSettingsComponent
  ]
})
export class Sage300SharedModule { }
