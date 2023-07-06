import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FyleIntegrationsSharedModule } from 'fyle-child';

import { IntegrationsSettingsSharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    IntegrationsSettingsSharedModule,
    FyleIntegrationsSharedModule,
    TooltipModule
  ]
})
export class DashboardModule { }
