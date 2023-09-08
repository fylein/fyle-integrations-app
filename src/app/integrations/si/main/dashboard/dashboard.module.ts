import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TabMenuModule } from 'primeng/tabmenu';


@NgModule({
  declarations: [
  ],
  imports: [
    TabMenuModule,
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
