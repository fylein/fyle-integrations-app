import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GustoComponent } from './gusto.component';

const routes: Routes = [
  {
    path: '',
    component: GustoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GustoRoutingModule { }
