import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig, brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-netsuite-configuration',
  templateUrl: './netsuite-configuration.component.html',
  styleUrls: ['./netsuite-configuration.component.scss']
})
export class NetsuiteConfigurationComponent implements OnInit {

  modules: MenuItem[];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('netsuiteConfiguration.exportSettingStepName'), routerLink: '/integrations/netsuite/main/configuration/export_settings'},
      {label: this.translocoService.translate('netsuiteConfiguration.importSettingStepName'), routerLink: '/integrations/netsuite/main/configuration/import_settings'},
      {label: this.translocoService.translate('netsuiteConfiguration.advancedSettingsStepName'), routerLink: '/integrations/netsuite/main/configuration/advanced_settings'}
    ];
    this.activeModule = this.modules[0];
    // If (brandingConfig.brandId !== 'co') {
    //   This.modules.push({label: 'Connection', routerLink: '/integrations/netsuite/main/configuration/connector'});
    // }
  }

}
