import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './intacct-dashboard-routing.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { IntacctDashboardComponent } from './intacct-dashboard.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    IntacctDashboardComponent
  ],
  imports: [
    TabMenuModule,
    SharedModule,
    CommonModule,
    DashboardRoutingModule,
    SkeletonModule,
    DialogModule,
    TableModule
  ]
})
export class IntacctDashboardModule { }
