import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbdDashboardComponent } from './qbd-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: QbdDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QbdDashboardRoutingModule {}
