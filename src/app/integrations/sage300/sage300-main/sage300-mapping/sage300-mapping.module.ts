import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sage300MappingRoutingModule } from './sage300-mapping-routing.module';
import { Sage300MappingComponent } from './sage300-mapping.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    Sage300MappingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Sage300MappingRoutingModule
  ]
})
export class Sage300MappingModule { }
