import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingContent } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { DashboardService } from 'src/app/core/services/si/si-core/dashboard.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-intacct-main',
  templateUrl: './intacct-main.component.html',
  styleUrls: ['./intacct-main.component.scss']
})
export class MainComponent {

  readonly brandingContent = brandingContent.common;

  modules: MenuItem[];

  appName: AppName = AppName.INTACCT;

  constructor(
    private dashboardService: DashboardService,
    private mappingsService: SiMappingsService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) { 
    this.modules = [
      {label: this.translocoService.translate('main.dashboardLabel'), routerLink: '/integrations/intacct/main/dashboard'},
      {label: this.brandingContent.exportLogTabName, routerLink: '/integrations/intacct/main/export_log'},
      {label: this.translocoService.translate('main.mappingLabel'), routerLink: '/integrations/intacct/main/mapping'},
      {label: this.translocoService.translate('main.configurationLabel'), routerLink: '/integrations/intacct/main/configuration'}
    ];
  }

  refreshDimensions() {
    this.mappingsService.refreshSageIntacctDimensions().subscribe();
    this.mappingsService.refreshFyleDimensions().subscribe();
    this.dashboardService.syncExpensesFromFyle().subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('main.syncDataDimensionsToast'));
  }
}
