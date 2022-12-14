import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BambooHrComponent } from './bamboo-hr.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: BambooHrComponent,
    children: [
      {
        path: 'landing',
        component: LandingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BambooHrRoutingModule { }
