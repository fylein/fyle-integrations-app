import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300ExportSettingsComponent } from './sage300-export-settings/sage300-export-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    Sage300ExportSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    Sage300ExportSettingsComponent
  ]
})
export class Sage300SharedModule { }
