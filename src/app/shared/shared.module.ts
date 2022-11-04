import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/core/loader/loader.component';
import { AppHeaderComponent } from './components/apps/app-header/app-header.component';



@NgModule({
  declarations: [
    LoaderComponent,
    AppHeaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
