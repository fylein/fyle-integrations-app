import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QbdRoutingModule } from './qbd-routing.module';
import { LandingComponent } from './landing/landing.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    LandingComponent,
    ConfigurationComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    QbdRoutingModule
  ]
})
export class QbdModule { }
