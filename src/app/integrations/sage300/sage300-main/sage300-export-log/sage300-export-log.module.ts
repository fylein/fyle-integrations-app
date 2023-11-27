import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sage300ExportLogRoutingModule } from './sage300-export-log-routing.module';
import { Sage300CompletedExportLogComponent } from './sage300-completed-export-log/sage300-completed-export-log.component';

import { Sage300ExportLogComponent } from './sage300-export-log.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    Sage300ExportLogComponent,
    Sage300CompletedExportLogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Sage300ExportLogRoutingModule
  ]
})
export class Sage300ExportLogModule { }
