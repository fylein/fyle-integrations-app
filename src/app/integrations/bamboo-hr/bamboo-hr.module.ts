import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FyleIntegrationsSharedModule } from 'fyle-integrations-ui-lib';

import { BambooHrRoutingModule } from './bamboo-hr-routing.module';
import { BambooHrComponent } from './bamboo-hr.component';
import { ConfigurationComponent } from './configuration/configuration.component';

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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    BambooHrComponent,
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    BambooHrRoutingModule,
    FyleIntegrationsSharedModule,
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
    ProgressSpinnerModule,
    ToastModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ],
  providers: [
    MessageService
  ]
})
export class BambooHrModule { }
