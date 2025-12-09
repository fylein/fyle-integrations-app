import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessCentralRoutingModule } from './business-central-routing.module';
import { BusinessCentralComponent } from './business-central.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [BusinessCentralComponent],
  imports: [CommonModule, BusinessCentralRoutingModule, SharedModule],
})
export class BusinessCentralModule {}
