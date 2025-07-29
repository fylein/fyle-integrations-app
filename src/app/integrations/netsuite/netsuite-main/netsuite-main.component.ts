import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-netsuite-main',
    templateUrl: './netsuite-main.component.html',
    styleUrls: ['./netsuite-main.component.scss'],
    standalone: false
})
export class NetsuiteMainComponent {

  appName: AppName = AppName.NETSUITE;

  modules: MenuItem[];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private accountingExportService: AccountingExportService,
    private netsuiteHelperService: NetsuiteHelperService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) {
    this.modules = [
      {label: this.translocoService.translate('netsuiteMain.dashboardTab'), routerLink: '/integrations/netsuite/main/dashboard'},
      {label: this.translocoService.translate('common.exportLogTabName'), routerLink: '/integrations/netsuite/main/export_log'},
      {label: this.translocoService.translate('netsuiteMain.mappingTab'), routerLink: '/integrations/netsuite/main/mapping'},
      {label: this.translocoService.translate('netsuiteMain.configurationTab'), routerLink: '/integrations/netsuite/main/configuration'}
    ];
  }

  refreshDimensions() {
    this.netsuiteHelperService.refreshNetsuiteDimensions().subscribe();
    this.netsuiteHelperService.refreshFyleDimensions().subscribe();
    this.accountingExportService.importExpensesFromFyle('v1').subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('netsuiteMain.syncDataDimensionsToast'));
  }
}
