import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FyleIntegrationsSharedModule } from 'fyle-integrations-ui-lib';

import { TravelperkRoutingModule } from './travelperk-routing.module';
import { TravelperkComponent } from './travelperk.component';
import { SkeletonModule } from 'primeng/skeleton';


@NgModule({
  declarations: [
    TravelperkComponent
  ],
  imports: [
    CommonModule,
    FyleIntegrationsSharedModule,
    TravelperkRoutingModule,
    SkeletonModule
  ]
})
export class TravelperkModule { }
