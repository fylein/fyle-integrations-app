import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300MainRoutingModule } from './sage300-main-routing.module';
import { Sage300DashboardComponent } from './sage300-dashboard/sage300-dashboard.component';



@NgModule({
  declarations: [
    Sage300DashboardComponent
  ],
  imports: [
    CommonModule,
    Sage300MainRoutingModule
  ]
})
export class Sage300MainModule { }
