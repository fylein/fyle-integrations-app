import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { QboExportLogComponent } from './qbo-export-log.component';
import { QboCompleteExportLogComponent } from './qbo-complete-export-log/qbo-complete-export-log.component';
import { QboSkippedExportLogComponent } from './qbo-skipped-export-log/qbo-skipped-export-log.component';

const routes: Routes = [
  {
    path: '',
    component: QboExportLogComponent,
    children: [
      {
        path: 'complete',
        component: QboCompleteExportLogComponent
      },
      {
        path: 'skipped',
        component: QboSkippedExportLogComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboExportLogRoutingModule { }
