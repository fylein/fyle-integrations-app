import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-sage300-configuration',
  templateUrl: './sage300-configuration.component.html',
  styleUrls: ['./sage300-configuration.component.scss']
})
export class Sage300ConfigurationComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Export Settings', routerLink: '/integrations/sage300/main/configuration/export_settings'},
    {label: 'Import Settings', routerLink: '/integrations/sage300/main/configuration/import_settings'},
    {label: 'Advanced Settings', routerLink: '/integrations/sage300/main/configuration/advanced_settings'}
  ];

  activeModule: MenuItem = this.modules[0];

  constructor() { }

  ngOnInit(): void {
  }

}
