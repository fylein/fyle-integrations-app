import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QboExportLogComponent } from './qbo-export-log.component';
import { QboCompleteExportLogComponent } from './qbo-complete-export-log/qbo-complete-export-log.component';
import { SkippedExportLogComponent } from 'src/app/shared/pages/export-log/skipped-export-log/skipped-export-log.component';

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
        component: SkippedExportLogComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboExportLogRoutingModule { }
