import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetsuiteDashboardRoutingModule } from './netsuite-dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, NetsuiteDashboardRoutingModule, SharedModule],
})
export class NetsuiteDashboardModule {}
