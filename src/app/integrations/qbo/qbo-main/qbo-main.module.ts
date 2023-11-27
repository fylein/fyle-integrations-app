import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboMainRoutingModule } from './qbo-main-routing.module';
import { QboMainComponent } from './qbo-main.component';


@NgModule({
  declarations: [
    QboMainComponent
  ],
  imports: [
    CommonModule,
    QboMainRoutingModule
  ]
})
export class QboMainModule { }
