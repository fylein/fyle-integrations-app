import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationsRoutingModule } from './integrations-routing.module';
import { IntegrationsComponent } from './integrations.component';
import { LandingComponent } from './landing/landing.component';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { QbdComponent } from './qbd/qbd.component';
import { SharedModule } from '../shared/shared.module';
import { Sage300Component } from './sage300/sage300.component';
import { XeroComponent } from './xero/xero.component';
import { TravelperkComponent } from './travelperk/travelperk.component';

@NgModule({
  declarations: [
    IntegrationsComponent,
    LandingComponent,
    QbdComponent,
    Sage300Component,
    XeroComponent,
    TravelperkComponent
  ],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    SharedModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class IntegrationsModule { }
