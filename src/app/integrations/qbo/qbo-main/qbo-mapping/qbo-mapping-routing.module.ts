import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QboMappingComponent } from './qbo-mapping.component';
import { QboBaseMappingComponent } from './qbo-base-mapping/qbo-base-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: QboMappingComponent,
    children: [
      {
        path: ':source_field',
        component: QboBaseMappingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QboMappingRoutingModule {}
