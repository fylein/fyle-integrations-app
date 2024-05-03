import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetsuiteExportSettingsComponent } from './netsuite-export-settings/netsuite-export-settings.component';
import { NetsuiteImportSettingsComponent } from './netsuite-import-settings/netsuite-import-settings.component';
import { NetsuiteAdvancedSettingsComponent } from './netsuite-advanced-settings/netsuite-advanced-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { NetsuiteCustomeSegmentDialogComponent } from './netsuite-import-settings/netsuite-custome-segment-dialog/netsuite-custome-segment-dialog.component';
import { DialogModule } from 'primeng/dialog';



@NgModule({
  declarations: [
    NetsuiteExportSettingsComponent,
    NetsuiteImportSettingsComponent,
    NetsuiteAdvancedSettingsComponent,
    NetsuiteCustomeSegmentDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MultiSelectModule,
    DialogModule
  ],
  exports: [
    NetsuiteExportSettingsComponent,
    NetsuiteImportSettingsComponent,
    NetsuiteAdvancedSettingsComponent
  ]
})
export class NetsuiteSharedModule { }
