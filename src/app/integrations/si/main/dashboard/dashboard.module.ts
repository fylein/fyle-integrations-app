import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';


@NgModule({
  declarations: [
  ],
  imports: [
    TabMenuModule,
    SharedModule,
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
