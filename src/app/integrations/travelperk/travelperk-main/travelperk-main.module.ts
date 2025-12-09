import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelperkMainRoutingModule } from './travelperk-main-routing.module';
import { TravelperkConfigurationComponent } from './travelperk-configuration/travelperk-configuration.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [TravelperkConfigurationComponent],
  imports: [CommonModule, TravelperkMainRoutingModule, SharedModule],
})
export class TravelperkMainModule {}
