import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { EventsService } from 'src/app/core/services/common/events.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { DashboardService } from 'src/app/core/services/si/si-core/dashboard.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss']
})
export class DashboardMenuComponent implements OnInit {

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/intacct/main/dashboard'},
    {label: 'Export Log', routerLink: '/integrations/intacct/main/export_log'},
    {label: 'Mapping', routerLink: '/integrations/intacct/main/mapping'},
    {label: 'Configuration', routerLink: '/integrations/intacct/main/configuration'}
  ];

  activeModule: MenuItem;

  moreDropdown: null;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private dashboardService: DashboardService,
    private eventsService: EventsService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private mappingsService: SiMappingsService,
    private windowService: WindowService
  ) { }

  redirectToOldApp(): void {
    this.moreDropdown = null;
    this.eventsService.redirectToOldIntacctApp.subscribe((redirectUri: string) => {
      this.windowService.openInNewTab(redirectUri);
    });

    const payload = {
      callbackUrl: environment.si_callback_url,
      clientId: environment.si_client_id
    };

    this.eventsService.postEvent(payload);
  }

  refreshDimensions() {
    this.mappingsService.refreshSageIntacctDimensions().subscribe();
    this.mappingsService.refreshFyleDimensions().subscribe();
    this.dashboardService.syncExpensesFromFyle().subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Refreshing data dimensions from Sage Intacct...');
  }

  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
