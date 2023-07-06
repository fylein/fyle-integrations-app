import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FyleIntegrationsSharedModule } from 'fyle-child';

import { GustoRoutingModule } from './gusto-routing.module';
import { GustoComponent } from './gusto.component';
import { GustoConfigurationComponent } from './gusto-configuration/gusto-configuration.component';
import { IntegrationsSettingsSharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    GustoComponent,
    GustoConfigurationComponent
  ],
  imports: [
    CommonModule,
    GustoRoutingModule,
    IntegrationsSettingsSharedModule,
    FyleIntegrationsSharedModule,
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

  ]
})
export class GustoModule { }
