import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300MainRoutingModule } from './sage300-main-routing.module';
import { Sage300DashboardComponent } from './sage300-dashboard/sage300-dashboard.component';
import { SharedModule } from 'primeng/api';
import { Sage300MappingComponent } from './sage300-mapping/sage300-mapping.component';
import { Sage300CompletedExportLogComponent } from './sage300-export-log/sage300-completed-export-log/sage300-completed-export-log.component';
import { Sage300SkippedExportLogComponent } from './sage300-export-log/sage300-skipped-export-log/sage300-skipped-export-log.component';
import { Sage300ExportLogComponent } from './sage300-export-log/sage300-export-log.component';



@NgModule({
  declarations: [
    Sage300CompletedExportLogComponent,
    Sage300SkippedExportLogComponent,
    Sage300ExportLogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Sage300MainRoutingModule
  ]
})
export class Sage300MainModule { }
