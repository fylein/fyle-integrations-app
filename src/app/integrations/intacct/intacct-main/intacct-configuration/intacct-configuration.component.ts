import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-intacct-configuration',
  templateUrl: './intacct-configuration.component.html',
  styleUrls: ['./intacct-configuration.component.scss']
})
export class IntacctConfigurationComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Export Settings', routerLink: '/integrations/intacct/main/configuration/export_settings'},
    {label: 'Import Settings', routerLink: '/integrations/intacct/main/configuration/import_settings'},
    {label: 'Advanced Settings', routerLink: '/integrations/intacct/main/configuration/advanced_settings'}
  ];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
