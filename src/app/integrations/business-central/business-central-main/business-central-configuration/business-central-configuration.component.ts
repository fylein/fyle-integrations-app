import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-business-central-configuration',
  templateUrl: './business-central-configuration.component.html',
  styleUrls: ['./business-central-configuration.component.scss']
})
export class BusinessCentralConfigurationComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Export settings', routerLink: '/integrations/business_central/main/configuration/export_settings'},
    {label: 'Import settings', routerLink: '/integrations/business_central/main/configuration/import_settings'},
    {label: 'Advanced settings', routerLink: '/integrations/business_central/main/configuration/advanced_settings'}
  ];

  activeModule: MenuItem = this.modules[0];


  constructor() { }

  ngOnInit(): void {
  }

}
