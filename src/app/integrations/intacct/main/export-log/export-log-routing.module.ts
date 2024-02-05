import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportLogComponent } from './export-log.component';
import { SkipExportLogComponent } from './skip-export-log/skip-export-log.component';
import { CompletedExportLogComponent } from './completed-export-log/completed-export-log.component';

const routes: Routes = [
  {
    path: '',
    component: ExportLogComponent,
    children: [
      {
        path: 'complete_export_log',
        component: CompletedExportLogComponent
      },
      {
        path: 'skip_export_log',
        component: SkipExportLogComponent
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
