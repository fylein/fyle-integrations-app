import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GustoRoutingModule } from './gusto-routing.module';
import { GustoComponent } from './gusto.component';
import { GustoConfigurationComponent } from './gusto-configuration/gusto-configuration.component';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';


@NgModule({
  declarations: [
    GustoComponent,
    GustoConfigurationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GustoRoutingModule,
    InputTextModule,
    TableModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    SkeletonModule,
    ToastModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class GustoModule { }
