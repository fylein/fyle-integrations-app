import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetsuiteDashboardComponent } from './netsuite-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: NetsuiteDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetsuiteDashboardRoutingModule {}
