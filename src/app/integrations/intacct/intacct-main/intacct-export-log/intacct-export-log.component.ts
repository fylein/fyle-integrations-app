import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-intacct-export-log',
  templateUrl: './intacct-export-log.component.html',
  styleUrls: ['./intacct-export-log.component.scss']
})
export class IntacctExportLogComponent implements OnInit {

  isLoading: boolean = false;

  modules: MenuItem[];

  activeModule: MenuItem;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) { }


  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('intacctExportLog.completedTab'), routerLink: '/integrations/intacct/main/export_log/complete'},
      {label: this.translocoService.translate('intacctExportLog.skippedTab'), routerLink: '/integrations/intacct/main/export_log/skipped'}
    ];
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
