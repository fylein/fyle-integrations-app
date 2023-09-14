import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MappingComponent } from './mapping.component';
import { EmployeeMappingComponent } from './employee-mapping/employee-mapping.component';
import { CategoryMappingComponent } from './category-mapping/category-mapping.component';
import { GenericMappingComponent } from './generic-mapping/generic-mapping.component';


const routes: Routes = [
  {
    path: '',
    component: MappingComponent,
    children: [
      {
        path: 'employee_mapping',
        component: EmployeeMappingComponent
      },
      {
        path: 'category_mapping',
        component: CategoryMappingComponent
      },
      {
        path: 'generic_mapping',
        component: GenericMappingComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MappingRoutingModule { }
