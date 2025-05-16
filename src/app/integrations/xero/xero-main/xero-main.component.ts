import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';

@Component({
  selector: 'app-xero-main',
  templateUrl: './xero-main.component.html',
  styleUrls: ['./xero-main.component.scss']
})
export class XeroMainComponent {

  appName: AppName = AppName.XERO;

  readonly brandingContent = brandingContent.common;

  readonly disconnectButton = brandingFeatureConfig.featureFlags.dashboard.disconnectButton;

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/xero/main/dashboard'},
    {label: this.brandingContent.exportLogTabName, routerLink: '/integrations/xero/main/export_log'},
    {label: 'Mapping', routerLink: '/integrations/xero/main/mapping'},
    {label: 'Configuration', routerLink: '/integrations/xero/main/configuration'}
  ];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  isConnectionInProgress: boolean = false;

  constructor(
    private accountingExportService: AccountingExportService,
    private xeroHelperService: XeroHelperService,
    private router: Router,
    private toastService: IntegrationsToastService
  ) { }

  disconnect(): void {
    if (!this.isConnectionInProgress) {
      this.xeroHelperService.disconnect().subscribe(() => {
        this.isConnectionInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Disconnected Xero company successfully');
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
