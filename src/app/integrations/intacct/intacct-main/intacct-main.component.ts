import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { Router } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { brandingContent } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import type { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import type { DashboardService } from 'src/app/core/services/si/si-core/dashboard.service';
import type { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

@Component({
  selector: 'app-intacct-main',
  templateUrl: './intacct-main.component.html',
  styleUrls: ['./intacct-main.component.scss']
})
export class MainComponent implements OnInit {

  readonly brandingContent = brandingContent.common;

  modules: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/integrations/intacct/main/dashboard' },
    { label: this.brandingContent.exportLogTabName, routerLink: '/integrations/intacct/main/export_log' },
    { label: 'Mapping', routerLink: '/integrations/intacct/main/mapping' },
    { label: 'Configuration', routerLink: '/integrations/intacct/main/configuration' }
  ];

  activeModule: MenuItem;

  appName: AppName = AppName.INTACCT;

  constructor(
    private dashboardService: DashboardService,
    private mappingsService: SiMappingsService,
    private router: Router,
    private toastService: IntegrationsToastService
  ) { }

  refreshDimensions() {
    this.mappingsService.refreshSageIntacctDimensions().subscribe();
    this.mappingsService.refreshFyleDimensions().subscribe();
    this.dashboardService.syncExpensesFromFyle().subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from Sage Intacct...');
  }

  private setupPage() {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
