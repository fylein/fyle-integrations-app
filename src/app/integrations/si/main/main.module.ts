import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { ExportLogComponent } from './export-log/export-log.component';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabMenuModule } from 'primeng/tabmenu';



@NgModule({
  declarations: [
    ExportLogComponent
  ],
  imports: [
    CommonModule,
    TabMenuModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
