import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExportLogComponent } from './export-log.component';

const routes: Routes = [
  {
    path: '',
    component: ExportLogComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportLogRoutingModule { }
