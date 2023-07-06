import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DragDropModule } from 'primeng/dragdrop';
import { ProgressBarModule } from 'primeng/progressbar';

// External Libraries
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CascadeSelectModule } from "primeng/cascadeselect";

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule,
    TooltipModule,
    SkeletonModule,
    InputSwitchModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    MultiSelectModule,
    DragDropModule,
    ProgressBarModule,
    CalendarModule,
    CascadeSelectModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ],
  exports: [
    DropdownModule,
    CalendarModule,
    FormsModule, ReactiveFormsModule, ProgressBarModule,
    ToastModule,
    CascadeSelectModule
  ]
})
export class IntegrationsSettingsSharedModule { }
