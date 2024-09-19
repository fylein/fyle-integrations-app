import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BambooHrComponent } from './bamboo-hr.component';

const routes: Routes = [
  {
    path: '',
    component: BambooHrComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BambooHrRoutingModule { }
