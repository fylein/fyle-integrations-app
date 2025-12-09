import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboRoutingModule } from './qbo-routing.module';
import { QboComponent } from './qbo.component';

@NgModule({
  declarations: [QboComponent],
  imports: [CommonModule, QboRoutingModule],
})
export class QboModule {}
