import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelperkRoutingModule } from './travelperk-routing.module';
import { TravelperkComponent } from './travelperk.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TravelperkComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TravelperkRoutingModule
  ]
})
export class TravelperkModule { }
