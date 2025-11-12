import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-xero-export-log',
    templateUrl: './xero-export-log.component.html',
    styleUrls: ['./xero-export-log.component.scss'],
    standalone: false
})
export class XeroExportLogComponent implements OnInit {

  modules: TabMenuItem[];

  activeModule: string;

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
      {label: this.translocoService.translate('xeroExportLog.completedTab'), routerLink: '/integrations/xero/main/export_log/complete', value: 'complete'}
    ];
    this.activeModule = this.modules[0].value;
    this.router.navigateByUrl(this.modules[0].routerLink!);
  }

}
