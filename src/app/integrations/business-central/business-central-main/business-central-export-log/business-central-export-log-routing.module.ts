import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessCentralExportLogComponent } from './business-central-export-log.component';
import { BusinessCentralCompleteExportLogComponent } from './business-central-complete-export-log/business-central-complete-export-log.component';
import { BusinessCentralSkippedExportLogComponent } from './business-central-skipped-export-log/business-central-skipped-export-log.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessCentralExportLogComponent,
    children: [
      {
        path: 'complete_export_log',
        component: BusinessCentralCompleteExportLogComponent,
      },
      {
        path: 'skip_export_log',
        component: BusinessCentralSkippedExportLogComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessCentralExportLogRoutingModule {}
