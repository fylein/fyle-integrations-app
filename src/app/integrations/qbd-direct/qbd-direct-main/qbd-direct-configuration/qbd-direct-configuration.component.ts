import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-configuration',
  standalone: true,
  imports: [RouterModule, SharedModule, CommonModule],
  templateUrl: './qbd-direct-configuration.component.html',
  styleUrl: './qbd-direct-configuration.component.scss'
})
export class QbdDirectConfigurationComponent {

  readonly brandingContent = brandingContent.qbd_direct.configuration;

  modules: MenuItem[] = [
    {label: this.brandingContent.exportSetting.stepName, routerLink: '/integrations/qbd_direct/main/configuration/export_settings'},
    {label: this.brandingContent.importSetting.stepName, routerLink: '/integrations/qbd_direct/main/configuration/import_settings'},
    {label: this.brandingContent.advancedSettings.stepName, routerLink: '/integrations/qbd_direct/main/configuration/advanced_settings'}
  ];

  activeModule: MenuItem = this.modules[0];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

}
