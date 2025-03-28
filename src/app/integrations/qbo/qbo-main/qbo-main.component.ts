import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';

@Component({
  selector: 'app-qbo-main',
  templateUrl: './qbo-main.component.html',
  styleUrls: ['./qbo-main.component.scss']
})
export class QboMainComponent implements OnInit {

  appName: AppName = AppName.QBO;

  readonly brandingContent = brandingContent.common;

  isMenuDisabled: boolean = false;

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/qbo/main/dashboard', disabled: this.isMenuDisabled},
    {label: this.brandingContent.exportLogTabName, routerLink: '/integrations/qbo/main/export_log', disabled: this.isMenuDisabled},
    {label: 'Mapping', routerLink: '/integrations/qbo/main/mapping', disabled: this.isMenuDisabled},
    {label: 'Configuration', routerLink: '/integrations/qbo/main/configuration', disabled: this.isMenuDisabled}
  ];

  activeModule: MenuItem;

  isConnectionInProgress: boolean;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly disconnectButton = brandingFeatureConfig.featureFlags.dashboard.disconnectButton;

  constructor(
    private accountingExportService: AccountingExportService,
    private qboHelperService: QboHelperService,
    private router: Router,
    private toastService: IntegrationsToastService
  ) { }

  refreshDimensions() {
    this.qboHelperService.refreshQBODimensions().subscribe();
    this.qboHelperService.refreshFyleDimensions().subscribe();
    this.accountingExportService.importExpensesFromFyle('v1').subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from QuickBooks Online');
  }

  disconnect(): void {
    if (!this.isConnectionInProgress) {
      this.qboHelperService.disconnect().subscribe(() => {
        this.isConnectionInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Disconnected QuickBooks Online successfully');
        this.router.navigate(['/integrations/qbo/onboarding/landing']);
      });
    }
    this.isConnectionInProgress = true;
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
