import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-business-central-configuration',
  templateUrl: './business-central-configuration.component.html',
  styleUrls: ['./business-central-configuration.component.scss']
})
export class BusinessCentralConfigurationComponent implements OnInit {

  modules: MenuItem[] = [
    { label: 'Export Settings', routerLink: '/integrations/business_central/main/configuration/export_settings' },
    { label: 'Import Settings', routerLink: '/integrations/business_central/main/configuration/import_settings' },
    { label: 'Advanced Settings', routerLink: '/integrations/business_central/main/configuration/advanced_settings' }
  ];

  activeModule: MenuItem = this.modules[0];


  constructor() { }

  ngOnInit(): void {
  }

}
