import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BusinessCentralDashboardComponent } from './business-central-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessCentralDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessCentralDashboardRoutingModule { }
