import { Component, OnInit } from '@angular/core';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-business-central-configuration',
  templateUrl: './business-central-configuration.component.html',
  styleUrls: ['./business-central-configuration.component.scss'],
  standalone: false,
})
export class BusinessCentralConfigurationComponent implements OnInit {
  modules: TabMenuItem[];

  activeModule: string;

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.modules = [
      {
        label: this.translocoService.translate('businessCentralConfiguration.exportSettings'),
        routerLink: '/integrations/business_central/main/configuration/export_settings',
        value: 'export_settings',
      },
      {
        label: this.translocoService.translate('businessCentralConfiguration.importSettings'),
        routerLink: '/integrations/business_central/main/configuration/import_settings',
        value: 'import_settings',
      },
      {
        label: this.translocoService.translate('businessCentralConfiguration.advancedSettings'),
        routerLink: '/integrations/business_central/main/configuration/advanced_settings',
        value: 'advanced_settings',
      },
    ];

    this.activeModule = this.modules[0].value;
  }
}
