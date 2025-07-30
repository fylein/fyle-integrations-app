import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboConfigurationRoutingModule } from './qbo-configuration-routing.module';
import { QboSharedModule } from '../../qbo-shared/qbo-shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QboConfigurationRoutingModule,
    QboSharedModule
  ]
})
export class QboConfigurationModule { }
