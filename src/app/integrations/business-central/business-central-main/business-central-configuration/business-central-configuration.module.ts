import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessCentralConfigurationRoutingModule } from './business-central-configuration-routing.module';
import { BusinessCentralConfigurationComponent } from './business-central-configuration.component';


@NgModule({
  declarations: [
    BusinessCentralConfigurationComponent
  ],
  imports: [
    CommonModule,
    BusinessCentralConfigurationRoutingModule
  ]
})
export class BusinessCentralConfigurationModule { }
