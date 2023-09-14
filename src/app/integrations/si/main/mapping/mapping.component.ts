import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {

  mappingPages: MenuItem[] = [
    {label: 'Employee', routerLink: '/integrations/intacct/main/mapping/employee_mapping'},
    {label: 'Category', routerLink: '/integrations/intacct/main/mapping/category_mapping'},
    {label: 'Generic', routerLink: '/integrations/intacct/main/mapping/generic_mapping'},
  ];

  activeModule: MenuItem;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeModule = this.mappingPages[0];
    this.router.navigateByUrl(this.mappingPages[0].routerLink);
  }

}
