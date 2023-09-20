import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MappingRoutingModule } from './mapping-routing.module';
import { CategoryMappingComponent } from './category-mapping/category-mapping.component';
import { EmployeeMappingComponent } from './employee-mapping/employee-mapping.component';
import { GenericMappingComponent } from './generic-mapping/generic-mapping.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CategoryMappingComponent,
    EmployeeMappingComponent,
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
