import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { MappingComponent } from './intacct-mapping/mapping.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    MappingComponent
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
