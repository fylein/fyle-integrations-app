import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-xero-main',
    templateUrl: './xero-main.component.html',
    styleUrls: ['./xero-main.component.scss'],
    standalone: false
})
export class XeroMainComponent {

  appName: AppName = AppName.XERO;

  readonly disconnectButton = brandingFeatureConfig.featureFlags.dashboard.disconnectButton;

  modules: MenuItem[];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  isConnectionInProgress: boolean = false;

  constructor(
    private accountingExportService: AccountingExportService,
    private xeroHelperService: XeroHelperService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) {
    this.modules = [
      {label: this.translocoService.translate('xeroMain.dashboard'), routerLink: '/integrations/xero/main/dashboard'},
      {label: this.translocoService.translate('common.exportLogTabName'), routerLink: '/integrations/xero/main/export_log'},
      {label: this.translocoService.translate('xeroMain.mapping'), routerLink: '/integrations/xero/main/mapping'},
      {label: this.translocoService.translate('xeroMain.configuration'), routerLink: '/integrations/xero/main/configuration'}
    ];
  }

  disconnect(): void {
    if (!this.isConnectionInProgress) {
      this.xeroHelperService.disconnect().subscribe(() => {
        this.isConnectionInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('xeroMain.disconnectSuccess'));
        this.router.navigate(['/integrations/xero/disconnect/dashboard']);
      });
    }
    this.isConnectionInProgress = true;
  }

  refreshDimensions() {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
    this.xeroHelperService.refreshFyleDimensions().subscribe();
    this.accountingExportService.importExpensesFromFyle('v1').subscribe();
  }
}
