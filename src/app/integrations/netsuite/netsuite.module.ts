import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetsuiteRoutingModule } from './netsuite-routing.module';
import { NetsuiteComponent } from './netsuite.component';
import { NetsuiteConnectorComponent } from './netsuite-shared/netsuite-connector/netsuite-connector.component';


@NgModule({
  declarations: [
    NetsuiteComponent,
    NetsuiteConnectorComponent
  ],
  imports: [
    CommonModule,
    NetsuiteRoutingModule
  ]
})
export class NetsuiteModule { }
