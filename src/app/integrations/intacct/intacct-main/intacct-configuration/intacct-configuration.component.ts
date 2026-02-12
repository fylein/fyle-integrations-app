import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-intacct-configuration',
    templateUrl: './intacct-configuration.component.html',
    styleUrls: ['./intacct-configuration.component.scss'],
    standalone: false
})
export class IntacctConfigurationComponent implements OnInit {

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  modules: TabMenuItem[] = [];

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.modules = [
      { label: this.translocoService.translate('configuration.exportSetting.stepName'), routerLink: '/integrations/intacct/main/configuration/export_settings', value: 'export_settings' },
      { label: this.translocoService.translate('configuration.importSetting.stepName'), routerLink: '/integrations/intacct/main/configuration/import_settings', value: 'import_settings' },
      { label: this.translocoService.translate('configuration.advancedSettings.stepName'), routerLink: '/integrations/intacct/main/configuration/advanced_settings', value: 'advanced_settings' }
    ];
  }

}
