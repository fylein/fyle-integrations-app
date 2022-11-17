import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BambooHrRoutingModule } from './bamboo-hr-routing.module';
import { BambooHrComponent } from './bamboo-hr.component';
import { LandingComponent } from './landing/landing.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';


@NgModule({
  declarations: [
    BambooHrComponent,
    LandingComponent,
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    BambooHrRoutingModule,
    SharedModule,
    DialogModule,
    PasswordModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class BambooHrModule { }
