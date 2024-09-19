import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Sage300DashboardComponent } from './sage300-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: Sage300DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Sage300DashboardRoutingModule { }
