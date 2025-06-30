import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-xero-configuration',
  templateUrl: './xero-configuration.component.html',
  styleUrls: ['./xero-configuration.component.scss']
})
export class XeroConfigurationComponent implements OnInit {


  modules: MenuItem[] = [];

  activeModule: MenuItem = this.modules[0];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('xero.configuration.exportSetting.stepName'), routerLink: '/integrations/xero/main/configuration/export_settings'},
      {label: this.translocoService.translate('xero.configuration.importSetting.stepName'), routerLink: '/integrations/xero/main/configuration/import_settings'},
      {label: this.translocoService.translate('xero.configuration.advancedSettings.stepName'), routerLink: '/integrations/xero/main/configuration/advanced_settings'}
    ];
  }

}
