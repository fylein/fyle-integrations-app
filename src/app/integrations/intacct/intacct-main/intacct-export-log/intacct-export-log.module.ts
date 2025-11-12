import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportLogRoutingModule } from './intacct-export-log-routing.module';
import { IntacctExportLogComponent } from './intacct-export-log.component';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { DialogModule } from 'primeng/dialog';

import { IntacctSkipExportLogComponent } from './intacct-skip-export-log/intacct-skip-export-log.component';
import { IntacctCompletedExportLogComponent } from './intacct-completed-export-log/intacct-completed-export-log.component';


@NgModule({
  declarations: [
    IntacctExportLogComponent,
    IntacctSkipExportLogComponent,
    IntacctCompletedExportLogComponent
  ],
  imports: [

    DialogModule,
    SharedModule,
    CommonModule,
    ExportLogRoutingModule,
    TableModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class IntacctExportLogModule { }
