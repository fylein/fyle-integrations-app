import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntacctConfigurationRoutingModule } from './intacct-configuration-routing.module';
import { IntacctConfigurationComponent } from './intacct-configuration.component';


@NgModule({
  declarations: [
    IntacctConfigurationComponent
  ],
  imports: [
    CommonModule,
    IntacctConfigurationRoutingModule
  ]
})
export class IntacctConfigurationModule { }
