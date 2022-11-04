import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BambooHrRoutingModule } from './bamboo-hr-routing.module';
import { BambooHrComponent } from './bamboo-hr.component';
import { LandingComponent } from './landing/landing.component';
import { ConfigurationComponent } from './configuration/configuration.component';


@NgModule({
  declarations: [
    BambooHrComponent,
    LandingComponent,
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    BambooHrRoutingModule
  ]
})
export class BambooHrModule { }
