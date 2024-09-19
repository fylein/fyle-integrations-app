import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { QboDashboardComponent } from './qbo-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: QboDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboDashboardRoutingModule { }
