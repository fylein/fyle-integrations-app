import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FyleIntegrationsSharedModule } from 'fyle-integrations-ui-lib';

import { TravelperkRoutingModule } from './travelperk-routing.module';
import { TravelperkComponent } from './travelperk.component';
import { IntegrationsSettingsSharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';


@NgModule({
  declarations: [
    TravelperkComponent
  ],
  imports: [
    CommonModule,
    IntegrationsSettingsSharedModule,
    FyleIntegrationsSharedModule,
    TravelperkRoutingModule,
    SkeletonModule
  ]
})
export class TravelperkModule { }
