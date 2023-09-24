import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { WindowService } from 'src/app/core/services/core/window.service';
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

  constructor(
    private router: Router,
    private mappingsService: SiMappingsService,
    private windowService: WindowService
  ) { }

  redirectToOldApp(): void {
    this.windowService.redirect(environment.si_callback_url);
  }

  refreshSageIntacctDimension() {
    this.mappingsService.refreshSageIntacctDimensions().subscribe();
  }

  ngOnInit(): void {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
