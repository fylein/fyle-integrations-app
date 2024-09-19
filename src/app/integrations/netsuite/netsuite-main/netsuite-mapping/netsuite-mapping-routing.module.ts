import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NetsuiteMappingComponent } from './netsuite-mapping.component';
import { NetsuiteBaseMappingComponent } from './netsuite-base-mapping/netsuite-base-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: NetsuiteMappingComponent,
    children: [
      {
        path: ':source_field',
        component: NetsuiteBaseMappingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetsuiteMappingRoutingModule { }
