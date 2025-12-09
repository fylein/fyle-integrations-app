import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XeroMappingComponent } from './xero-mapping.component';
import { XeroBaseMappingComponent } from './xero-base-mapping/xero-base-mapping.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: XeroMappingComponent,
    children: [
      {
        path: ':source_field',
        component: XeroBaseMappingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XeroMappingRoutingModule {}
