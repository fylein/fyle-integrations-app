import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetsuiteRoutingModule } from './netsuite-routing.module';
import { NetsuiteComponent } from './netsuite.component';


@NgModule({
  declarations: [
    NetsuiteComponent
  ],
  imports: [
    CommonModule,
    NetsuiteRoutingModule
  ]
})
export class NetsuiteModule { }
