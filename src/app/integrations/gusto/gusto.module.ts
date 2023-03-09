import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GustoRoutingModule } from './gusto-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';


@NgModule({
  declarations: [
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    GustoRoutingModule
  ]
})
export class GustoModule { }
