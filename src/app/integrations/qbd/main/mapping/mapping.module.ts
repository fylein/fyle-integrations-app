import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MappingRoutingModule } from './mapping-routing.module';

import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { GenericMappingComponent } from './generic-mapping/generic-mapping.component';


@NgModule({
  declarations: [
    GenericMappingComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    TabMenuModule,
    SharedModule,
    MappingRoutingModule
  ]
})
export class MappingModule { }
