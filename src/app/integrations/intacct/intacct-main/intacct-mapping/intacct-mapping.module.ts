import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntacctMappingRoutingModule } from './intacct-mapping-routing.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntacctMappingComponent } from './intacct-mapping.component';
import { IntacctBaseMappingComponent } from './intacct-base-mapping/intacct-base-mapping.component';


@NgModule({
  declarations: [
    IntacctMappingComponent,
    IntacctBaseMappingComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    TabMenuModule,
    SharedModule,
    IntacctMappingRoutingModule
  ]
})
export class IntacctMappingModule { }
