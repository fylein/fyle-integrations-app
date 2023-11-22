import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300ConfigurationExportSettingsComponent } from './sage300-configuration-export-settings/sage300-configuration-export-settings.component';
import { Sage300ConfigurationImportSettingsComponent } from './sage300-configuration-import-settings/sage300-configuration-import-settings.component';
import { Sage300ConfigurationAdvancedSettingsComponent } from './sage300-configuration-advanced-settings/sage300-configuration-advanced-settings.component';
import { Sage300SharedModule } from '../../sage300-shared/sage300-shared.module';



@NgModule({
  declarations: [
    Sage300ConfigurationExportSettingsComponent,
    Sage300ConfigurationImportSettingsComponent,
    Sage300ConfigurationAdvancedSettingsComponent
  ],
  imports: [
    CommonModule,
    Sage300SharedModule
  ]
})
export class Sage300ConfigurationModule { }
