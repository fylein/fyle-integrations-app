import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { MappingComponent } from './mapping/mapping.component';



@NgModule({
  declarations: [
    MappingComponent
  ],
  imports: [
    CommonModule,
    TabMenuModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
