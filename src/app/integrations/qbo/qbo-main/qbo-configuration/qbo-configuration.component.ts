import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbo-configuration',
  templateUrl: './qbo-configuration.component.html',
  styleUrls: ['./qbo-configuration.component.scss']
})
export class QboConfigurationComponent implements OnInit {

  modules: MenuItem[] = [];

  activeModule: MenuItem = this.modules[0];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('configuration.exportSetting.stepName'), routerLink: '/integrations/qbo/main/configuration/export_settings'},
      {label: this.translocoService.translate('configuration.importSetting.stepName'), routerLink: '/integrations/qbo/main/configuration/import_settings'},
      {label: this.translocoService.translate('configuration.advancedSettings.stepName'), routerLink: '/integrations/qbo/main/configuration/advanced_settings'}
    ];
  }

}
