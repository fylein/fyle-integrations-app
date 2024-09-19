import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IntacctDashboardComponent } from './intacct-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: IntacctDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
