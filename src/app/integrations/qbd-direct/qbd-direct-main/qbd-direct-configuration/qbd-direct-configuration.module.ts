import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QbdDirectConfigurationRoutingModule } from './qbd-direct-configuration-routing.module';
import { QbdDirectConfigurationComponent } from './qbd-direct-configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, QbdDirectConfigurationComponent, QbdDirectConfigurationRoutingModule, SharedModule],
})
export class QbdDirectConfigurationModule {}
