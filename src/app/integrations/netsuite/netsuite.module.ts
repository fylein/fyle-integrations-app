import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetsuiteRoutingModule } from './netsuite-routing.module';
import { NetsuiteComponent } from './netsuite.component';
import { NetsuiteConnectorComponent } from './netsuite-shared/netsuite-connector/netsuite-connector.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NetsuiteSharedModule } from './netsuite-shared/netsuite-shared-module';
import { NetsuiteExportSettingsComponent } from './netsuite-shared/netsuite-export-settings/netsuite-export-settings.component';


@NgModule({
  declarations: [
    NetsuiteComponent,
    NetsuiteConnectorComponent
  ],
  imports: [
    CommonModule,
    NetsuiteRoutingModule,
    SharedModule,
  ]
})
export class NetsuiteModule { }
