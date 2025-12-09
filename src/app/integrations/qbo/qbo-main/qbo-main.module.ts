import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboMainRoutingModule } from './qbo-main-routing.module';
import { QboMainComponent } from './qbo-main.component';
import { QboDashboardComponent } from './qbo-dashboard/qbo-dashboard.component';
import { QboExportLogComponent } from './qbo-export-log/qbo-export-log.component';
import { QboCompleteExportLogComponent } from './qbo-export-log/qbo-complete-export-log/qbo-complete-export-log.component';
import { QboMappingComponent } from './qbo-mapping/qbo-mapping.component';
import { QboBaseMappingComponent } from './qbo-mapping/qbo-base-mapping/qbo-base-mapping.component';
import { QboConfigurationComponent } from './qbo-configuration/qbo-configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    QboMainComponent,
    QboDashboardComponent,
    QboExportLogComponent,
    QboCompleteExportLogComponent,
    QboMappingComponent,
    QboBaseMappingComponent,
    QboConfigurationComponent,
  ],
  imports: [CommonModule, QboMainRoutingModule, SharedModule],
})
export class QboMainModule {}
