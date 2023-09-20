import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MappingComponent } from './mapping.component';
import { GenericMappingComponent } from 'src/app/integrations/qbd/main/mapping/generic-mapping/generic-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: MappingComponent,
    children: [
      {
        path: ':source_field',
        component: GenericMappingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MappingRoutingModule { }
