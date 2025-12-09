import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XeroConfigurationRoutingModule } from './xero-configuration-routing.module';
import { XeroConfigurationComponent } from './xero-configuration.component';
import { XeroSharedModule } from '../../xero-shared/xero-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [XeroConfigurationComponent],
  imports: [CommonModule, XeroSharedModule, SharedModule, XeroConfigurationRoutingModule],
})
export class XeroConfigurationModule {}
