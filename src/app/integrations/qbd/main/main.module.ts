import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FyleIntegrationsSharedModule } from 'fyle-child';

import { IntegrationsSettingsSharedModule } from 'src/app/shared/shared.module';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MainRoutingModule,
    IntegrationsSettingsSharedModule,
    FyleIntegrationsSharedModule
  ]
})
export class MainModule { }
