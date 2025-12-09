import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sage300ExportLogRoutingModule } from './sage300-export-log-routing.module';
import { Sage300ExportLogComponent } from './sage300-export-log.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage300CompleteExportLogComponent } from './sage300-complete-export-log/sage300-complete-export-log.component';
import { Sage300SkippedExportLogComponent } from './sage300-skipped-export-log/sage300-skipped-export-log.component';

@NgModule({
  declarations: [Sage300ExportLogComponent, Sage300CompleteExportLogComponent, Sage300SkippedExportLogComponent],
  imports: [CommonModule, SharedModule, Sage300ExportLogRoutingModule],
})
export class Sage300ExportLogModule {}
