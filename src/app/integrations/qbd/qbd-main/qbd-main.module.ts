import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainRoutingModule } from './qbd-main-routing.module';
import { QbdConfigurationComponent } from './qbd-configuration/qbd-configuration.component';
import { QbdDashboardComponent } from './qbd-dashboard/qbd-dashboard.component';
import { QbdMappingComponent } from './qbd-mapping/qbd-mapping.component';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    QbdConfigurationComponent,
    QbdDashboardComponent,
    QbdMappingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TabsModule,
    SelectModule,
    TableModule,
    MainRoutingModule,
    TooltipModule
  ]
})
export class QbdMainModule { }
