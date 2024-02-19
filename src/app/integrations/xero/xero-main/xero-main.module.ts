import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XeroMainRoutingModule } from './xero-main-routing.module';
import { XeroMainComponent } from './xero-main.component';
import { XeroDashboardComponent } from './xero-dashboard/xero-dashboard.component';
import { XeroMappingComponent } from './xero-mapping/xero-mapping.component';
import { XeroExportLogComponent } from './xero-export-log/xero-export-log.component';


@NgModule({
  declarations: [
    XeroMainComponent,
    XeroDashboardComponent,
    XeroMappingComponent,
    XeroExportLogComponent
  ],
  imports: [
    CommonModule,
    XeroMainRoutingModule
  ]
})
export class XeroMainModule { }
