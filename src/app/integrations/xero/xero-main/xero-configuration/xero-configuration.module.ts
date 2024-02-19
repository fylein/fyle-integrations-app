import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XeroConfigurationRoutingModule } from './xero-configuration-routing.module';
import { XeroConfigurationComponent } from './xero-configuration.component';


@NgModule({
  declarations: [
    XeroConfigurationComponent
  ],
  imports: [
    CommonModule,
    XeroConfigurationRoutingModule
  ]
})
export class XeroConfigurationModule { }
