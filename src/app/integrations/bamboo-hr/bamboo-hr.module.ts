import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BambooHrRoutingModule } from './bamboo-hr-routing.module';
import { BambooHrComponent } from './bamboo-hr.component';
import { LandingComponent } from './landing/landing.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';


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
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    DropdownModule,
    MultiSelectModule,
    SkeletonModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class BambooHrModule { }
