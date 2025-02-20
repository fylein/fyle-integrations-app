import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { brandingContent, brandingFeatureConfig, brandingConfig, brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-netsuite-configuration',
  templateUrl: './netsuite-configuration.component.html',
  styleUrls: ['./netsuite-configuration.component.scss']
})
export class NetsuiteConfigurationComponent implements OnInit {

  readonly brandingContent = brandingContent.netsuite.configuration;

  modules: MenuItem[] = [
    {label: this.brandingContent.exportSetting.stepName, routerLink: '/integrations/netsuite/main/configuration/export_settings'},
    {label: this.brandingContent.importSetting.stepName, routerLink: '/integrations/netsuite/main/configuration/import_settings'},
    {label: this.brandingContent.advancedSettings.stepName, routerLink: '/integrations/netsuite/main/configuration/advanced_settings'}
  ];

  activeModule: MenuItem = this.modules[0];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor() { }

  ngOnInit(): void {
    // If (brandingConfig.brandId !== 'co') {
    //   This.modules.push({label: 'Connection', routerLink: '/integrations/netsuite/main/configuration/connector'});
    // }
  }

}
