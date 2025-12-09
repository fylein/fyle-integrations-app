import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessCentralMainRoutingModule } from './business-central-main-routing.module';
import { BusinessCentralConfigurationComponent } from './business-central-configuration/business-central-configuration.component';
import { BusinessCentralDashboardComponent } from './business-central-dashboard/business-central-dashboard.component';
import { BusinessCentralExportLogComponent } from './business-central-export-log/business-central-export-log.component';
import { BusinessCentralMappingComponent } from './business-central-mapping/business-central-mapping.component';
import { BusinessCentralMainComponent } from './business-central-main.component';
import { BusinessCentralBaseMappingComponent } from './business-central-mapping/business-central-base-mapping/business-central-base-mapping.component';
import { BusinessCentralCompleteExportLogComponent } from './business-central-export-log/business-central-complete-export-log/business-central-complete-export-log.component';
import { BusinessCentralSkippedExportLogComponent } from './business-central-export-log/business-central-skipped-export-log/business-central-skipped-export-log.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    BusinessCentralConfigurationComponent,
    BusinessCentralDashboardComponent,
    BusinessCentralExportLogComponent,
    BusinessCentralMappingComponent,
    BusinessCentralBaseMappingComponent,
    BusinessCentralCompleteExportLogComponent,
    BusinessCentralSkippedExportLogComponent,
    BusinessCentralMainComponent,
  ],
  imports: [CommonModule, SharedModule, BusinessCentralMainRoutingModule],
})
export class BusinessCentralMainModule {}
