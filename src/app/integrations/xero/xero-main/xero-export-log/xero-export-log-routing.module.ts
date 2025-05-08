import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroCompleteExportLogComponent } from './xero-complete-export-log/xero-complete-export-log.component';
import { XeroExportLogComponent } from './xero-export-log.component';

const routes: Routes = [
  {
    path: '',
    component: XeroExportLogComponent,
    children: [
      {
        path: 'complete',
        component: XeroCompleteExportLogComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XeroExportLogRoutingModule { }
