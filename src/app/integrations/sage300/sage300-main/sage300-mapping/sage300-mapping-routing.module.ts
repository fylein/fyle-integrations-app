import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sage300MappingComponent } from './sage300-mapping.component';
import { Sage300BaseMappingComponent } from './sage300-base-mapping/sage300-base-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: Sage300MappingComponent,
    children: [
      {
        path: 'mapping/:source_field',
        component: Sage300BaseMappingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Sage300MappingRoutingModule { }
