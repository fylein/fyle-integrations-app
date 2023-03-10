import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationsRoutingModule } from './integrations-routing.module';
import { IntegrationsComponent } from './integrations.component';
import { LandingComponent } from './landing/landing.component';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { QbdComponent } from './qbd/qbd.component';
import { SharedModule } from '../shared/shared.module';
import { GustoComponent } from './gusto/gusto.component';
import { SkeletonModule } from 'primeng/skeleton';


@NgModule({
  declarations: [
    IntegrationsComponent,
    LandingComponent,
    QbdComponent,
    GustoComponent
  ],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    SharedModule,
    SkeletonModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class IntegrationsModule { }
