import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDirectDownloadFileComponent } from './qbd-direct-download-file/qbd-direct-download-file.component';
import { QbdDirectSetupConnectionComponent } from './qbd-direct-setup-connection/qbd-direct-setup-connection.component';
import { QbdDirectDataSyncComponent } from './qbd-direct-data-sync/qbd-direct-data-sync.component';
import { QbdDirectExportSettingsComponent } from './qbd-direct-export-settings/qbd-direct-export-settings.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    QbdDirectDownloadFileComponent,
    QbdDirectSetupConnectionComponent,
    QbdDirectDataSyncComponent,
    QbdDirectExportSettingsComponent
  ],
  exports: [
    QbdDirectDownloadFileComponent,
    QbdDirectSetupConnectionComponent,
    QbdDirectDataSyncComponent,
    QbdDirectExportSettingsComponent
  ]
})
export class QbdDirectSharedModule { }
