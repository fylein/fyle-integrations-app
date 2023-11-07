import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300MainRoutingModule } from './sage300-main-routing.module';
import { Sage300DashboardComponent } from './sage300-dashboard/sage300-dashboard.component';
import { SharedModule } from 'primeng/api';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    Sage300MainRoutingModule
  ]
})
export class Sage300MainModule { }
