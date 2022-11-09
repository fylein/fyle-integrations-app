import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationsRoutingModule } from './integrations-routing.module';
import { IntegrationsComponent } from './integrations.component';
import { LandingComponent } from './landing/landing.component';
import { IconSpriteModule } from 'ng-svg-icon-sprite';


@NgModule({
  declarations: [
    IntegrationsComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
    IntegrationsRoutingModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class IntegrationsModule { }
