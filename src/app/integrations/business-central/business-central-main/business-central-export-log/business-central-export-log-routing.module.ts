import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessCentralExportLogComponent } from './business-central-export-log.component';
import { BusinessCentralCompleteExportLogComponent } from './business-central-complete-export-log/business-central-complete-export-log.component';
import { BusinessCentralSkippedExportLogComponent } from './business-central-skipped-export-log/business-central-skipped-export-log.component';

const routes: Routes = [
  {
    path: 'export_log',
    component: BusinessCentralExportLogComponent,
    children: [
      {
        path: 'complete',
        component: BusinessCentralCompleteExportLogComponent
      },
      {
        path: 'skipped',
        component: BusinessCentralSkippedExportLogComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessCentralExportLogRoutingModule { }
