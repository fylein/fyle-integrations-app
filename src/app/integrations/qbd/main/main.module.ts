import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
// Import { TabMenuModule } from 'primeng/tabmenu';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
    // TabMenuModule,
  ]
})
export class MainModule { }
