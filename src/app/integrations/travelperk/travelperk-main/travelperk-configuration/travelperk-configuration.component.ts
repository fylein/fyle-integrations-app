import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-travelperk-configuration',
  templateUrl: './travelperk-configuration.component.html',
  styleUrls: ['./travelperk-configuration.component.scss']
})
export class TravelperkConfigurationComponent implements OnInit {

  modules: MenuItem[] = [
    { label: 'Payment Profile Settings', routerLink: '/integrations/travelperk/main/configuration/payment_profile_settings' },
    { label: 'Advanced Settings', routerLink: '/integrations/travelperk/main/configuration/advanced_settings' }
  ];

  activeModule: MenuItem = this.modules[0];

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  ngOnInit(): void {
  }

}
