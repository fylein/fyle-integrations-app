import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntacctMappingComponent } from './intacct-mapping.component';
import { IntacctBaseMappingComponent } from './intacct-base-mapping/intacct-base-mapping.component';


const routes: Routes = [
  {
    path: ':source_field',
    component: IntacctBaseMappingComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntacctMappingRoutingModule { }
