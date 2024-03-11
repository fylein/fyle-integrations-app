import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportLogRoutingModule } from './intacct-export-log-routing.module';
import { IntacctExportLogComponent } from './intacct-export-log.component';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { IntacctSkipExportLogComponent } from './intacct-skip-export-log/intacct-skip-export-log.component';
import { IntacctCompletedExportLogComponent } from './intacct-completed-export-log/intacct-completed-export-log.component';


@NgModule({
  declarations: [
    IntacctExportLogComponent,
    IntacctSkipExportLogComponent,
    IntacctCompletedExportLogComponent
  ],
  imports: [
    TabMenuModule,
    DialogModule,
    SharedModule,
    CommonModule,
    ExportLogRoutingModule,
    TableModule
  ]
})
export class IntacctExportLogModule { }
