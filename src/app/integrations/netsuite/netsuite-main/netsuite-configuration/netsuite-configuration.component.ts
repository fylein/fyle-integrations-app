import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig, brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';

@Component({
  selector: 'app-netsuite-configuration',
  templateUrl: './netsuite-configuration.component.html',
  styleUrls: ['./netsuite-configuration.component.scss']
})
export class NetsuiteConfigurationComponent implements OnInit {

  modules: MenuItem[] = [];

  activeModule: MenuItem = this.modules[0];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(private translocoService: TranslocoService, private router: Router) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('netsuite.configuration.exportSetting.stepName'), routerLink: '/integrations/netsuite/main/configuration/export_settings'},
      {label: this.translocoService.translate('netsuite.configuration.importSetting.stepName'), routerLink: '/integrations/netsuite/main/configuration/import_settings'},
      {label: this.translocoService.translate('netsuite.configuration.advancedSettings.stepName'), routerLink: '/integrations/netsuite/main/configuration/advanced_settings'}
    ];

    this.router.navigate([this.modules[0].routerLink]);
  }

}
