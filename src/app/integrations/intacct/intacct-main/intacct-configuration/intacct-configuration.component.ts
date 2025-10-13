import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-intacct-configuration',
  templateUrl: './intacct-configuration.component.html',
  styleUrls: ['./intacct-configuration.component.scss']
})
export class IntacctConfigurationComponent implements OnInit {

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  modules: MenuItem[] = [];

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('configuration.exportSetting.stepName'), routerLink: '/integrations/intacct/main/configuration/export_settings'},
      {label: this.translocoService.translate('configuration.importSetting.stepName'), routerLink: '/integrations/intacct/main/configuration/import_settings'},
      {label: this.translocoService.translate('configuration.advancedSettings.stepName'), routerLink: '/integrations/intacct/main/configuration/advanced_settings'}
    ];
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
