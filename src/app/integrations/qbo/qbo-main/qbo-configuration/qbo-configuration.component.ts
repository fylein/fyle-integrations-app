import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-qbo-configuration',
  templateUrl: './qbo-configuration.component.html',
  styleUrls: ['./qbo-configuration.component.scss']
})
export class QboConfigurationComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Map Employees', routerLink: '/integrations/qbo/main/configuration/employee_settings'},
    {label: 'Export Settings', routerLink: '/integrations/qbo/main/configuration/export_settings'},
    {label: 'Import Settings', routerLink: '/integrations/qbo/main/configuration/import_settings'},
    {label: 'Advanced Settings', routerLink: '/integrations/qbo/main/configuration/advanced_settings'}
  ];

  activeModule: MenuItem = this.modules[0];

  constructor() { }

  ngOnInit(): void {
  }

}
