import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BambooHrRoutingModule } from './bamboo-hr-routing.module';
import { BambooHrComponent } from './bamboo-hr.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
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
    SharedModule,
    DialogModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    SelectModule,
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
