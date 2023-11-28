import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessCentralMainRoutingModule } from './business-central-main-routing.module';
import { BusinessCentralConfigurationComponent } from './business-central-configuration/business-central-configuration.component';
import { BusinessCentralDashboardComponent } from './business-central-dashboard/business-central-dashboard.component';
import { BusinessCentralExportLogComponent } from './business-central-export-log/business-central-export-log.component';
import { BusinessCentralMappingComponent } from './business-central-mapping/business-central-mapping.component';


@NgModule({
  declarations: [
    BusinessCentralConfigurationComponent,
    BusinessCentralDashboardComponent,
    BusinessCentralExportLogComponent,
    BusinessCentralMappingComponent
  ],
  imports: [
    CommonModule,
    BusinessCentralMainRoutingModule
  ]
})
export class BusinessCentralMainModule { }
