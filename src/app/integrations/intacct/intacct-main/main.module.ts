import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './intacct-main-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    TabMenuModule,
    ButtonModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
