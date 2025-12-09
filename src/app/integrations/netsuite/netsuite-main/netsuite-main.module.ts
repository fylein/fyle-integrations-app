import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetsuiteMainRoutingModule } from './netsuite-main-routing.module';
import { NetsuiteMainComponent } from './netsuite-main.component';
import { NetsuiteDashboardComponent } from './netsuite-dashboard/netsuite-dashboard.component';
import { NetsuiteExportLogComponent } from './netsuite-export-log/netsuite-export-log.component';
import { NetsuiteCompleteExportLogsComponent } from './netsuite-export-log/netsuite-complete-export-logs/netsuite-complete-export-logs.component';
import { NetsuiteSkippedExportLogComponent } from './netsuite-export-log/netsuite-skipped-export-log/netsuite-skipped-export-log.component';
import { NetsuiteMappingComponent } from './netsuite-mapping/netsuite-mapping.component';
import { NetsuiteBaseMappingComponent } from './netsuite-mapping/netsuite-base-mapping/netsuite-base-mapping.component';
import { NetsuiteConfigurationComponent } from './netsuite-configuration/netsuite-configuration.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    NetsuiteMainComponent,
    NetsuiteDashboardComponent,
    NetsuiteExportLogComponent,
    NetsuiteCompleteExportLogsComponent,
    NetsuiteSkippedExportLogComponent,
    NetsuiteMappingComponent,
    NetsuiteBaseMappingComponent,
    NetsuiteConfigurationComponent,
  ],
  imports: [CommonModule, NetsuiteMainRoutingModule, SharedModule],
})
export class NetsuiteMainModule {}
