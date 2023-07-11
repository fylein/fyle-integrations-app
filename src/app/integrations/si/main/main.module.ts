import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { ExportLogComponent } from './export-log/export-log.component';



@NgModule({
  declarations: [
    MainComponent,
    ExportLogComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MainModule { }
