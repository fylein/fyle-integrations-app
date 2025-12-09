import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbdDirectBaseMappingComponent } from './qbd-direct-base-mapping/qbd-direct-base-mapping.component';
import { QbdDirectMappingComponent } from './qbd-direct-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: QbdDirectMappingComponent,
    children: [
      {
        path: ':source_field',
        component: QbdDirectBaseMappingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QbdDirectMappingRoutingModule {}
