import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboRoutingModule } from './qbo-routing.module';
import { QboComponent } from './qbo.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    QboComponent
  ],
  imports: [
    CommonModule,
    QboRoutingModule,
    SharedModule
  ]
})
export class QboModule { }
