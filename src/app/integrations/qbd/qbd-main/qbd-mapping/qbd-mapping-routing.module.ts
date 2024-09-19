import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { QbdMappingComponent } from './qbd-mapping.component';
import { QbdGenericMappingComponent } from 'src/app/integrations/qbd/qbd-main/qbd-mapping/qbd-generic-mapping/qbd-generic-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: QbdMappingComponent,
    children: [
      {
        path: ':source_field',
        component: QbdGenericMappingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QbdMappingRoutingModule { }
