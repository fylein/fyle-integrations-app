import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QbdDirectRoutingModule } from './qbd-direct-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDirectComponent } from './qbd-direct.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QbdDirectRoutingModule,
    SharedModule,
    QbdDirectComponent
  ]
})
export class QbdDirectModule { }
