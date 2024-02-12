import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetsuiteExportSettingsComponent } from './netsuite-export-settings/netsuite-export-settings.component';
import { NetsuiteImportSettingsComponent } from './netsuite-import-settings/netsuite-import-settings.component';
import { NetsuiteAdvancedSettingsComponent } from './netsuite-advanced-settings/netsuite-advanced-settings.component';



@NgModule({
  declarations: [
    NetsuiteExportSettingsComponent,
    NetsuiteImportSettingsComponent,
    NetsuiteAdvancedSettingsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class NetsuiteSharedModule { }