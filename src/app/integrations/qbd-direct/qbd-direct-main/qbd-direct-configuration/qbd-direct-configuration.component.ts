import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-direct-configuration',
  standalone: true,
  imports: [RouterModule, SharedModule, CommonModule, TranslocoModule],
  templateUrl: './qbd-direct-configuration.component.html',
  styleUrl: './qbd-direct-configuration.component.scss'
})
export class QbdDirectConfigurationComponent {

  modules: MenuItem[] = [];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(private translocoService: TranslocoService) {
    this.modules = [
      {label: this.translocoService.translate('qbd_direct.configuration.exportSetting.stepName'), routerLink: '/integrations/qbd_direct/main/configuration/export_settings'},
      {label: this.translocoService.translate('qbd_direct.configuration.importSetting.stepName'), routerLink: '/integrations/qbd_direct/main/configuration/import_settings'},
      {label: this.translocoService.translate('qbd_direct.configuration.advancedSettings.stepName'), routerLink: '/integrations/qbd_direct/main/configuration/advanced_settings'}
    ];

    this.activeModule = this.modules[0];
  }

}
