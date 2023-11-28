import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessCentralDashboardRoutingModule } from './business-central-dashboard-routing.module';
import { BusinessCentralDashboardComponent } from './business-central-dashboard.component';


@NgModule({
  declarations: [
    BusinessCentralDashboardComponent
  ],
  imports: [
    CommonModule,
    BusinessCentralDashboardRoutingModule
  ]
})
export class BusinessCentralDashboardModule { }
