import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportLogRoutingModule } from './export-log-routing.module';
import { ExportLogComponent } from './export-log.component';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ExportLogComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ExportLogRoutingModule,
    TableModule
  ]
})
export class ExportLogModule { }
