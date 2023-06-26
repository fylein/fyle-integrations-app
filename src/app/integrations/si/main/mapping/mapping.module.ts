import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MappingRoutingModule } from './mapping-routing.module';
import { MappingComponent } from './mapping.component';
import { CategoryMappingComponent } from './category-mapping/category-mapping.component';
import { EmployeeMappingComponent } from './employee-mapping/employee-mapping.component';
import { GenericMappingComponent } from './generic-mapping/generic-mapping.component';


@NgModule({
  declarations: [
    MappingComponent,
    CategoryMappingComponent,
    EmployeeMappingComponent,
    GenericMappingComponent
  ],
  imports: [
    CommonModule,
    MappingRoutingModule
  ]
})
export class MappingModule { }
