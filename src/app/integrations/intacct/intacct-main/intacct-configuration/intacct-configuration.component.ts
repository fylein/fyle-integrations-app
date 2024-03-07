import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-intacct-configuration',
  templateUrl: './intacct-configuration.component.html',
  styleUrls: ['./intacct-configuration.component.scss']
})
export class IntacctConfigurationComponent implements OnInit {

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent;

  modules: MenuItem[] = [
    {label: this.brandingContent.configuration.exportSetting.stepName, routerLink: '/integrations/intacct/main/configuration/export_settings'},
    {label: this.brandingContent.configuration.importSetting.stepName, routerLink: '/integrations/intacct/main/configuration/import_settings'},
    {label: this.brandingContent.configuration.advancedSettings.stepName, routerLink: '/integrations/intacct/main/configuration/advanced_settings'}
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
