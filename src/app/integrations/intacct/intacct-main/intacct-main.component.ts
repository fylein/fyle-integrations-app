import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabMenuItem } from 'src/app/core/models/common/tab-menu.model';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { DashboardService } from 'src/app/core/services/si/si-core/si-dashboard.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-intacct-main',
    templateUrl: './intacct-main.component.html',
    styleUrls: ['./intacct-main.component.scss'],
    standalone: false
})
export class MainComponent {

  modules: TabMenuItem[];

  appName: AppName = AppName.INTACCT;

  constructor(
    private dashboardService: DashboardService,
    private mappingsService: SiMappingsService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) {
    this.modules = [
      { label: this.translocoService.translate('intacctMain.dashboardLabel'), routerLink: '/integrations/intacct/main/dashboard', value: 'dashboard' },
      { label: this.translocoService.translate('common.exportLogTabName'), routerLink: '/integrations/intacct/main/export_log', value: 'export_log' },
      { label: this.translocoService.translate('intacctMain.mappingLabel'), routerLink: '/integrations/intacct/main/mapping', value: 'mapping' },
      { label: this.translocoService.translate('intacctMain.configurationLabel'), routerLink: '/integrations/intacct/main/configuration', value: 'configuration' }
    ];
  }

  refreshDimensions() {
    this.mappingsService.refreshSageIntacctDimensions().subscribe();
    this.mappingsService.refreshFyleDimensions().subscribe();
    this.dashboardService.syncExpensesFromFyle().subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('intacctMain.syncDataDimensionsToast'));
  }
}
