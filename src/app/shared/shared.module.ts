import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/core/loader/loader.component';
import { AppHeaderComponent } from './components/apps/app-header/app-header.component';

// External Libraries
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    LoaderComponent,
    AppHeaderComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule
  ],
  exports: [
    LoaderComponent,
    AppHeaderComponent
  ]
})
export class SharedModule { }
