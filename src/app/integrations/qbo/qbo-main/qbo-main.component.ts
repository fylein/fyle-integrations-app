import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbo-main',
  templateUrl: './qbo-main.component.html',
  styleUrls: ['./qbo-main.component.scss']
})
export class QboMainComponent implements OnInit {

  appName: AppName = AppName.QBO;

  readonly brandingContent = brandingContent.common;


  modules: MenuItem[];

  isConnectionInProgress: boolean;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly disconnectButton = brandingFeatureConfig.featureFlags.dashboard.disconnectButton;

  constructor(
    private accountingExportService: AccountingExportService,
    private qboHelperService: QboHelperService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('qboMain.dashboardLabel'), routerLink: '/integrations/qbo/main/dashboard'},
      {label: this.brandingContent.exportLogTabName, routerLink: '/integrations/qbo/main/export_log'},
      {label: this.translocoService.translate('qboMain.mappingLabel'), routerLink: '/integrations/qbo/main/mapping'},
      {label: this.translocoService.translate('qboMain.configurationLabel'), routerLink: '/integrations/qbo/main/configuration'}
    ];
  }

  refreshDimensions() {
    this.qboHelperService.refreshQBODimensions().subscribe();
    this.qboHelperService.refreshFyleDimensions().subscribe();
    this.accountingExportService.importExpensesFromFyle('v1').subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qboMain.syncDataDimensionsSuccess'));
  }

  disconnect(): void {
    if (!this.isConnectionInProgress) {
      this.qboHelperService.disconnect().subscribe(() => {
        this.isConnectionInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qboMain.disconnectSuccess'));
        this.router.navigate(['/integrations/qbo/disconnect/dashboard']);
      });
    }
    this.isConnectionInProgress = true;
  }
}
