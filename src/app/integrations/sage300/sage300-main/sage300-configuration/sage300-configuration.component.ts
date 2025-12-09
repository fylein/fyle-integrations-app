import { Component, OnInit } from '@angular/core';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-sage300-configuration',
  templateUrl: './sage300-configuration.component.html',
  styleUrls: ['./sage300-configuration.component.scss'],
  standalone: false,
})
export class Sage300ConfigurationComponent implements OnInit {
  modules: TabMenuItem[];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.modules = [
      {
        label: this.translocoService.translate('sage300Configuration.exportSettings'),
        routerLink: '/integrations/sage300/main/configuration/export_settings',
        value: 'export_settings',
      },
      {
        label: this.translocoService.translate('sage300Configuration.importSettings'),
        routerLink: '/integrations/sage300/main/configuration/import_settings',
        value: 'import_settings',
      },
      {
        label: this.translocoService.translate('sage300Configuration.advancedSettings'),
        routerLink: '/integrations/sage300/main/configuration/advanced_settings',
        value: 'advanced_settings',
      },
    ];

    this.activeModule = this.modules[0].value;
  }
}
