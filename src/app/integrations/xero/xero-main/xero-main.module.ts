import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XeroMainRoutingModule } from './xero-main-routing.module';
import { XeroMainComponent } from './xero-main.component';
import { XeroDashboardComponent } from './xero-dashboard/xero-dashboard.component';
import { XeroMappingComponent } from './xero-mapping/xero-mapping.component';
import { XeroExportLogComponent } from './xero-export-log/xero-export-log.component';
import { XeroSharedModule } from '../xero-shared/xero-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { XeroCompleteExportLogComponent } from './xero-export-log/xero-complete-export-log/xero-complete-export-log.component';
import { XeroBaseMappingComponent } from './xero-mapping/xero-base-mapping/xero-base-mapping.component';


@NgModule({
  declarations: [
    XeroMainComponent,
    XeroDashboardComponent,
    XeroMappingComponent,
    XeroExportLogComponent,
    XeroCompleteExportLogComponent,
    XeroBaseMappingComponent
  ],
  imports: [
    CommonModule,
    XeroSharedModule,
    SharedModule,
    XeroMainRoutingModule
  ]
})
export class XeroMainModule { }
