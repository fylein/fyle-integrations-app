import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300ExportSettingsComponent } from './sage300-export-settings/sage300-export-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage300ImportSettingsComponent } from './sage300-import-settings/sage300-import-settings.component';



@NgModule({
  declarations: [
    Sage300ExportSettingsComponent,
    Sage300ImportSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    Sage300ExportSettingsComponent,
    Sage300ImportSettingsComponent
  ]
})
export class Sage300SharedModule { }
