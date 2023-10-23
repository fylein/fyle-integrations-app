import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300DashboardRoutingModule } from './sage300-dashboard-routing.module';
import { SharedModule } from 'primeng/api';
import { Sage300DashboardComponent } from './sage300-dashboard.component';



@NgModule({
  declarations: [
    Sage300DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Sage300DashboardRoutingModule
  ]
})
export class Sage300DashboardModule { }
