import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessCentralExportLogRoutingModule } from './business-central-export-log-routing.module';
import { BusinessCentralCompleteExportLogComponent } from './business-central-complete-export-log/business-central-complete-export-log.component';
import { BusinessCentralSkippedExportLogComponent } from './business-central-skipped-export-log/business-central-skipped-export-log.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, BusinessCentralExportLogRoutingModule],
})
export class BusinessCentralExportLogModule {}
