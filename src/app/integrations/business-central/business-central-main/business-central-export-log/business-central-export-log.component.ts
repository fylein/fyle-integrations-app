import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-business-central-export-log',
    templateUrl: './business-central-export-log.component.html',
    styleUrls: ['./business-central-export-log.component.scss'],
    standalone: false
})
export class BusinessCentralExportLogComponent implements OnInit {

  isLoading: boolean = false;

  modules: MenuItem[];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) { }


  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('businessCentralExportLog.completed'), routerLink: '/integrations/business_central/main/export_log/complete_export_log'},
      {label: this.translocoService.translate('businessCentralExportLog.skipped'), routerLink: '/integrations/business_central/main/export_log/skip_export_log'}
    ];
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
