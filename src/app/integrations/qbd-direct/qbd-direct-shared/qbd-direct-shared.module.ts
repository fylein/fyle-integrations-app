import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDirectDownloadFileComponent } from './qbd-direct-download-file/qbd-direct-download-file.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    QbdDirectDownloadFileComponent
  ],
  exports: [
    QbdDirectDownloadFileComponent
  ]
})
export class QbdDirectSharedModule { }
