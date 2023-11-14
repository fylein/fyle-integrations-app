import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sage300-mapping',
  templateUrl: './sage300-mapping.component.html',
  styleUrls: ['./sage300-mapping.component.scss']
})
export class Sage300MappingComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Employee Mapping', routerLink: '/integrations/sage300/main/mapping/employee'},
    {label: 'Category Mapping', routerLink: '/integrations/intacct/main/configuration/category'},
    {label: 'Generic Mapping', routerLink: '/integrations/intacct/main/configuration/generic'}
  ];

  activeModule: MenuItem;

  constructor() { }

  ngOnInit(): void {
  }
}
