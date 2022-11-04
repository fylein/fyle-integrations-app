import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/core/loader/loader.component';
import { AppHeaderComponent } from './components/apps/app-header/app-header.component';

// External Libraries
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [
    LoaderComponent,
    AppHeaderComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule
  ],
  exports: [
    LoaderComponent
  ]
})
export class SharedModule { }
