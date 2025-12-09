import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbdDirectDashboardComponent } from './qbd-direct-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: QbdDirectDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QbdDirectDashboardRoutingModule {}
