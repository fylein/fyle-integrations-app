import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabMenuModule } from 'primeng/tabmenu';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    TabMenuModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
