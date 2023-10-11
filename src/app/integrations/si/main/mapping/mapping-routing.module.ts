import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MappingComponent } from './mapping.component';
import { EmployeeMappingComponent } from './employee-mapping/employee-mapping.component';
import { CategoryMappingComponent } from './category-mapping/category-mapping.component';
import { GenericMappingComponent } from './generic-mapping/generic-mapping.component';
import { GenericMappingTestComponent } from './generic-mapping-test/generic-mapping-test.component';


const routes: Routes = [
  {
    path: '',
    component: MappingComponent,
    children: [
      {
        path: 'test_mapping',
        component: GenericMappingTestComponent
      },
      {
        path: 'employee_mapping',
        component: EmployeeMappingComponent
      },
      {
        path: 'category_mapping',
        component: CategoryMappingComponent
      },
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
