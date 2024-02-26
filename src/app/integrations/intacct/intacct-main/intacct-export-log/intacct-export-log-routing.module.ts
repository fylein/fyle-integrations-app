import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntacctExportLogComponent } from './intacct-export-log.component';
import { IntacctSkipExportLogComponent } from './intacct-skip-export-log/skip-export-log.component';
import { IntacctCompletedExportLogComponent } from './intacct-completed-export-log/intacct-completed-export-log.component';

const routes: Routes = [
  {
    path: '',
    component: IntacctExportLogComponent,
    children: [
      {
        path: 'complete_export_log',
        component: IntacctCompletedExportLogComponent
      },
      {
        path: 'skip_export_log',
        component: IntacctSkipExportLogComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportLogRoutingModule { }
