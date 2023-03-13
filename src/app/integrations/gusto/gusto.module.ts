import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GustoRoutingModule } from './gusto-routing.module';
import { GustoComponent } from './gusto.component';
import { GustoConfigurationComponent } from './gusto-configuration/gusto-configuration.component';


@NgModule({
  declarations: [
    GustoComponent,
    GustoConfigurationComponent
  ],
  imports: [
    CommonModule,
    GustoRoutingModule
  ]
})
export class GustoModule { }
