import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationsRoutingModule } from './integrations-routing.module';
import { IntegrationsComponent } from './integrations.component';
import { LandingComponent } from './landing/landing.component';
import { QbdComponent } from './qbd/qbd.component';
import { SharedModule } from '../shared/shared.module';
import { Sage300Component } from './sage300/sage300.component';
import { XeroComponent } from './xero/xero.component';
import { TravelperkComponent } from './travelperk/travelperk.component';
import { LandingV2Component } from './landing-v2/landing-v2.component';

@NgModule({
  declarations: [
    IntegrationsComponent,
    LandingComponent,
    QbdComponent,
    Sage300Component,
    XeroComponent,
    TravelperkComponent,
    LandingV2Component
  ],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    SharedModule,
  ]
})
export class IntegrationsModule { }
