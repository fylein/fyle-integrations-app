import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDashboardRoutingModule } from './qbd-dashboard-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [],
  imports: [CommonModule, QbdDashboardRoutingModule, SharedModule, TooltipModule],
})
export class QbdDashboardModule {}
