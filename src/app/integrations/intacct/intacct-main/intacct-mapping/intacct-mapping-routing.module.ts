import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntacctMappingComponent } from './intacct-mapping.component';


const routes: Routes = [
  {
    path: '',
    component: IntacctMappingComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntacctMappingRoutingModule { }
