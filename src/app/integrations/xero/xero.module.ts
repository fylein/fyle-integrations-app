import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XeroRoutingModule } from './xero-routing.module';
import { XeroSharedModule } from './xero-shared/xero-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, XeroRoutingModule, XeroSharedModule, SharedModule],
})
export class XeroModule {}
