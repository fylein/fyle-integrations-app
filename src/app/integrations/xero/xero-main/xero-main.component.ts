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
export class XeroMainComponent implements OnInit {

  appName: AppName = AppName.XERO;

  readonly brandingContent = brandingContent.common;

  readonly disconnectButton = brandingFeatureConfig.featureFlags.dashboard.disconnectButton;

  isMenuDisabled: boolean = false;

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/xero/main/dashboard', disabled: this.isMenuDisabled},
    {label: this.brandingContent.exportLogTabName, routerLink: '/integrations/xero/main/export_log', disabled: this.isMenuDisabled},
    {label: 'Mapping', routerLink: '/integrations/xero/main/mapping', disabled: this.isMenuDisabled},
    {label: 'Configuration', routerLink: '/integrations/xero/main/configuration', disabled: this.isMenuDisabled}
  ];

  activeModule: MenuItem;

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
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Disconnected Xero Company successfully');
        this.router.navigate(['/integrations/xero/onboarding/landing']);
      });
    }
    this.isConnectionInProgress = true;
  }

  refreshDimensions() {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
    this.xeroHelperService.refreshFyleDimensions().subscribe();
    this.accountingExportService.importExpensesFromFyle('v1').subscribe();
  }

  private setupPage() {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);

    if (this.router.url.includes("/token-expired/")){
      this.isMenuDisabled = true;
      this.modules = this.modules.map(item => ({ ...item, disabled: this.isMenuDisabled }));
    }
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
