import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Sage300ExportLogComponent } from './sage300-export-log.component';
import { Sage300SkippedExportLogComponent } from './sage300-skipped-export-log/sage300-skipped-export-log.component';
import { Sage300CompleteExportLogComponent } from './sage300-complete-export-log/sage300-complete-export-log.component';

const routes: Routes = [
  {
    path: '',
    component: Sage300ExportLogComponent,
    children: [
      {
        path: 'complete_export_log',
        component: Sage300CompleteExportLogComponent
      },
      {
        path: 'skip_export_log',
        component: Sage300SkippedExportLogComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Sage300ExportLogRoutingModule { }
