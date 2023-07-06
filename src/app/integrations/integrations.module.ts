import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FyleIntegrationsSharedModule } from 'fyle-integrations-ui-lib';

import { IntegrationsRoutingModule } from './integrations-routing.module';
import { IntegrationsComponent } from './integrations.component';
import { LandingComponent } from './landing/landing.component';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { QbdComponent } from './qbd/qbd.component';


@NgModule({
  declarations: [
    IntegrationsComponent,
    LandingComponent,
    QbdComponent
  ],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    FyleIntegrationsSharedModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class IntegrationsModule { }
