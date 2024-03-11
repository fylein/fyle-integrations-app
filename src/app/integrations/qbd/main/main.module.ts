import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MappingComponent } from './mapping/mapping.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    ConfigurationComponent,
    DashboardComponent,
    MappingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TabMenuModule,
    DropdownModule,
    TableModule,
    MainRoutingModule
  ]
})
export class MainModule { }
