import { Component, OnInit } from '@angular/core';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-travelperk-configuration',
    templateUrl: './travelperk-configuration.component.html',
    styleUrls: ['./travelperk-configuration.component.scss'],
    standalone: false
})
export class TravelperkConfigurationComponent implements OnInit {

  modules: TabMenuItem[];

  activeModule: string;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private translocoService: TranslocoService
  ) {
    this.modules = [
      {label: this.translocoService.translate('travelperkConfiguration.paymentProfileSettings'), routerLink: '/integrations/travelperk/main/configuration/payment_profile_settings', value: 'payment_profile_settings'},
      {label: this.translocoService.translate('travelperkConfiguration.advancedSettings'), routerLink: '/integrations/travelperk/main/configuration/advanced_settings', value: 'advanced_settings'}
    ];

    this.activeModule = this.modules[0].value;
  }

  ngOnInit(): void {
  }

}
