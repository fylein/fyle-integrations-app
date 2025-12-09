import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdMappingRoutingModule } from './qbd-mapping-routing.module';

import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { QbdGenericMappingComponent } from './qbd-generic-mapping/qbd-generic-mapping.component';

@NgModule({
  declarations: [QbdGenericMappingComponent],
  imports: [CommonModule, TableModule, TabsModule, SharedModule, QbdMappingRoutingModule],
})
export class QbdMappingModule {}
