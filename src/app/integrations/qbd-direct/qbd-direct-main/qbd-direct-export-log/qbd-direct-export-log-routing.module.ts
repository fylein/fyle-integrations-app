import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbdDirectExportLogComponent } from './qbd-direct-export-log.component';
import { QbdDirectCompleteExportLogComponent } from './qbd-direct-complete-export-log/qbd-direct-complete-export-log.component';
import { SkippedExportLogComponent } from 'src/app/shared/pages/export-log/skipped-export-log/skipped-export-log.component';

const routes: Routes = [
  {
    path: '',
    component: QbdDirectExportLogComponent,
    children: [
      {
        path: 'complete',
        component: QbdDirectCompleteExportLogComponent
      },
      {
        path: 'skipped',
        component: SkippedExportLogComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QbdDirectExportLogRoutingModule { }
