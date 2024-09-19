import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { XeroSkippedExportLogComponent } from './xero-skipped-export-log/xero-skipped-export-log.component';
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
