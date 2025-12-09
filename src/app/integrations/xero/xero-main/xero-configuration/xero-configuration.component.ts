import { Component, OnInit } from '@angular/core';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';

@Component({
  selector: 'app-xero-configuration',
  templateUrl: './xero-configuration.component.html',
  styleUrls: ['./xero-configuration.component.scss'],
  standalone: false,
})
export class XeroConfigurationComponent implements OnInit {
  modules: TabMenuItem[] = [];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private translocoService: TranslocoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.modules = [
      {
        label: this.translocoService.translate('xero.configuration.exportSetting.stepName'),
        routerLink: '/integrations/xero/main/configuration/export_settings',
        value: 'export_settings',
      },
      {
        label: this.translocoService.translate('xero.configuration.importSetting.stepName'),
        routerLink: '/integrations/xero/main/configuration/import_settings',
        value: 'import_settings',
      },
      {
        label: this.translocoService.translate('xero.configuration.advancedSettings.stepName'),
        routerLink: '/integrations/xero/main/configuration/advanced_settings',
        value: 'advanced_settings',
      },
    ];

    this.activeModule = this.modules[0].value;
    this.router.navigate([this.modules[0].routerLink]);
  }
}
