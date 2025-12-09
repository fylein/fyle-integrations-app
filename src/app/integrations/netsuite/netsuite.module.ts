import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetsuiteRoutingModule } from './netsuite-routing.module';
import { NetsuiteComponent } from './netsuite.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NetsuiteComponent],
  imports: [CommonModule, NetsuiteRoutingModule, SharedModule],
})
export class NetsuiteModule {}
