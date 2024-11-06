import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDirectDownloadFileComponent } from './qbd-direct-download-file/qbd-direct-download-file.component';
import { QbdDirectSetupConnectionComponent } from './qbd-direct-setup-connection/qbd-direct-setup-connection.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    QbdDirectDownloadFileComponent,
    QbdDirectSetupConnectionComponent
  ],
  exports: [
    QbdDirectDownloadFileComponent,
    QbdDirectSetupConnectionComponent
  ]
})
export class QbdDirectSharedModule { }
