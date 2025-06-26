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

  modules: MenuItem[] = []

  activeModule: MenuItem = this.modules[0];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('netsuite.configuration.exportSetting.stepName'), routerLink: '/integrations/netsuite/main/configuration/export_settings'},
      {label: this.translocoService.translate('netsuite.configuration.importSetting.stepName'), routerLink: '/integrations/netsuite/main/configuration/import_settings'},
      {label: this.translocoService.translate('netsuite.configuration.advancedSettings.stepName'), routerLink: '/integrations/netsuite/main/configuration/advanced_settings'}
    ];
    // If (brandingConfig.brandId !== 'co') {
    //   This.modules.push({label: 'Connection', routerLink: '/integrations/netsuite/main/configuration/connector'});
    // }
  }

}
