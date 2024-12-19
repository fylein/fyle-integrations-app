import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-qbo-configuration',
  templateUrl: './qbo-configuration.component.html',
  styleUrls: ['./qbo-configuration.component.scss']
})
export class QboConfigurationComponent implements OnInit {

  readonly brandingContent = brandingContent.configuration;

  modules: MenuItem[] = [
    {label: this.brandingContent.exportSetting.stepName, routerLink: '/integrations/qbo/main/configuration/export_settings'},
    {label: this.brandingContent.importSetting.stepName, routerLink: '/integrations/qbo/main/configuration/import_settings'},
    {label: this.brandingContent.advancedSettings.stepName, routerLink: '/integrations/qbo/main/configuration/advanced_settings'}
  ];

  activeModule: MenuItem = this.modules[0];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
    if (!brandingFeatureConfig.featureFlags.mapEmployees) {
      this.modules.splice(0, 1);
    }
  }

}
