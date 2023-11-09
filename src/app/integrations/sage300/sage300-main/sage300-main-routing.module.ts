import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Sage300MainComponent } from './sage300-main.component';

const routes: Routes = [
  {
    path: '',
    component: Sage300MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./sage300-dashboard/sage300-dashboard.module').then(m => m.Sage300DashboardModule)
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class Sage300MainRoutingModule { }
