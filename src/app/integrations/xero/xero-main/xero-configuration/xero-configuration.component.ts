import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-xero-configuration',
  templateUrl: './xero-configuration.component.html',
  styleUrls: ['./xero-configuration.component.scss']
})
export class XeroConfigurationComponent implements OnInit {

  readonly brandingContent = brandingContent.xero.configuration;

  modules: MenuItem[] = [
    {label: this.brandingContent.exportSetting.stepName, routerLink: '/integrations/xero/main/configuration/export_settings'},
    {label: this.brandingContent.importSetting.stepName, routerLink: '/integrations/xero/main/configuration/import_settings'},
    {label: this.brandingContent.advancedSettings.stepName, routerLink: '/integrations/xero/main/configuration/advanced_settings'}
  ];

  activeModule: MenuItem = this.modules[0];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor() { }

  ngOnInit(): void {
  }

}
