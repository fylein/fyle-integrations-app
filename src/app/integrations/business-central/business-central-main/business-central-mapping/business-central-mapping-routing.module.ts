import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BusinessCentralMappingComponent } from './business-central-mapping.component';
import { BusinessCentralBaseMappingComponent } from './business-central-base-mapping/business-central-base-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessCentralMappingComponent,
    children: [
      {
        path: ':source_field',
        component: BusinessCentralBaseMappingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessCentralMappingRoutingModule { }
