import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationsRoutingModule } from './integrations-routing.module';
import { IntegrationsComponent } from './integrations.component';
import { LandingComponent } from './landing/landing.component';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { QbdComponent } from './qbd/qbd.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    IntegrationsComponent,
    LandingComponent,
    QbdComponent
  ],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    SharedModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class IntegrationsModule { }
