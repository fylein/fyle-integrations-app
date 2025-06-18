import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-sage300-configuration',
  templateUrl: './sage300-configuration.component.html',
  styleUrls: ['./sage300-configuration.component.scss']
})
export class Sage300ConfigurationComponent implements OnInit {

  modules: MenuItem[];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('sage300Configuration.exportSettings'), routerLink: '/integrations/sage300/main/configuration/export_settings'},
      {label: this.translocoService.translate('sage300Configuration.importSettings'), routerLink: '/integrations/sage300/main/configuration/import_settings'},
      {label: this.translocoService.translate('sage300Configuration.advancedSettings'), routerLink: '/integrations/sage300/main/configuration/advanced_settings'}
    ];
  
    this.activeModule = this.modules[0];
  }

}
