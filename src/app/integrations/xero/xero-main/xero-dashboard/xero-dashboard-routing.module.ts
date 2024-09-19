import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { XeroDashboardComponent } from './xero-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: XeroDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XeroDashboardRoutingModule { }
