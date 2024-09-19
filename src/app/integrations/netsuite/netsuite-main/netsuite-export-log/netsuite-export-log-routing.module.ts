import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NetsuiteExportLogComponent } from './netsuite-export-log.component';
import { NetsuiteCompleteExportLogsComponent } from './netsuite-complete-export-logs/netsuite-complete-export-logs.component';
import { NetsuiteSkippedExportLogComponent } from './netsuite-skipped-export-log/netsuite-skipped-export-log.component';

const routes: Routes = [
  {
    path: '',
    component: NetsuiteExportLogComponent,
    children: [
      {
        path: 'complete',
        component: NetsuiteCompleteExportLogsComponent
      },
      {
        path: 'skipped',
        component: NetsuiteSkippedExportLogComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetsuiteExportLogRoutingModule { }
