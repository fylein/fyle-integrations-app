import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelperkMainRoutingModule } from './travelperk-main-routing.module';
import { TravelperkConfigurationComponent } from './travelperk-configuration/travelperk-configuration.component';


@NgModule({
  declarations: [
    TravelperkConfigurationComponent
  ],
  imports: [
    CommonModule,
    TravelperkMainRoutingModule
  ]
})
export class TravelperkMainModule { }
