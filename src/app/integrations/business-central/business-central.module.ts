import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessCentralRoutingModule } from './business-central-routing.module';
import { BusinessCentralComponent } from './business-central.component';


@NgModule({
  declarations: [
    BusinessCentralComponent
  ],
  imports: [
    CommonModule,
    BusinessCentralRoutingModule
  ]
})
export class BusinessCentralModule { }
