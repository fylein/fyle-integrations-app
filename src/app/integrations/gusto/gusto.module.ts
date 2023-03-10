import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GustoRoutingModule } from './gusto-routing.module';

import { GustoComponent } from './gusto.component';
import { ConfigurationComponent } from './configuration/configuration.component';


@NgModule({
  declarations: [
    GustoComponent,
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    GustoRoutingModule
  ]
})
export class GustoModule { }
