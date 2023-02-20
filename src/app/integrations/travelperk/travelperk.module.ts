import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelperkRoutingModule } from './travelperk-routing.module';
import { TravelperkComponent } from './travelperk.component';


@NgModule({
  declarations: [
    TravelperkComponent
  ],
  imports: [
    CommonModule,
    TravelperkRoutingModule
  ]
})
export class TravelperkModule { }
