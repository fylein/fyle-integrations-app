import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntacctConfigurationRoutingModule } from './intacct-configuration-routing.module';
import { IntacctConfigurationComponent } from './intacct-configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [IntacctConfigurationComponent],
  imports: [CommonModule, SharedModule, IntacctConfigurationRoutingModule],
})
export class IntacctConfigurationModule {}
