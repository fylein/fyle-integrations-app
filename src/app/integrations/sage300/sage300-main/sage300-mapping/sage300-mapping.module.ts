import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sage300MappingRoutingModule } from './sage300-mapping-routing.module';
import { Sage300MappingComponent } from './sage300-mapping.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage300BaseMappingComponent } from './sage300-base-mapping/sage300-base-mapping.component';

@NgModule({
  declarations: [Sage300MappingComponent, Sage300BaseMappingComponent],
  imports: [CommonModule, SharedModule, Sage300MappingRoutingModule],
})
export class Sage300MappingModule {}
