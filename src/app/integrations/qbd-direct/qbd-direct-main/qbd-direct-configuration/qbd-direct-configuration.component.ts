import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-qbd-direct-configuration',
    imports: [RouterModule, SharedModule, CommonModule, TranslocoModule],
    templateUrl: './qbd-direct-configuration.component.html',
    styleUrl: './qbd-direct-configuration.component.scss'
})
export class QbdDirectConfigurationComponent {

  modules: TabMenuItem[] = [];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(private translocoService: TranslocoService, private router: Router) {
    this.modules = [
      {label: this.translocoService.translate('qbd_direct.configuration.exportSetting.stepName'), routerLink: '/integrations/qbd_direct/main/configuration/export_settings', value: 'export_settings'},
      {label: this.translocoService.translate('qbd_direct.configuration.importSetting.stepName'), routerLink: '/integrations/qbd_direct/main/configuration/import_settings', value: 'import_settings'},
      {label: this.translocoService.translate('qbd_direct.configuration.advancedSettings.stepName'), routerLink: '/integrations/qbd_direct/main/configuration/advanced_settings', value: 'advanced_settings'}
    ];

    this.router.navigate([this.modules[0].routerLink]);
  }

}
