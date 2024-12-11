import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';

@Component({
  selector: 'app-netsuite-main',
  templateUrl: './netsuite-main.component.html',
  styleUrls: ['./netsuite-main.component.scss']
})
export class NetsuiteMainComponent implements OnInit {

  appName: AppName = AppName.NETSUITE;

  readonly brandingContent = brandingContent.common;

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/netsuite/main/dashboard'},
    {label: this.brandingContent.exportLogTabName, routerLink: '/integrations/netsuite/main/export_log'},
    {label: 'Mapping', routerLink: '/integrations/netsuite/main/mapping'},
    {label: 'Configuration', routerLink: '/integrations/netsuite/main/configuration'}
  ];

  activeModule: MenuItem;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private accountingExportService: AccountingExportService,
    private netsuiteHelperService: NetsuiteHelperService,
    private router: Router,
    private toastService: IntegrationsToastService
  ) { }

  refreshDimensions() {
    this.netsuiteHelperService.refreshNetsuiteDimensions().subscribe();
    this.netsuiteHelperService.refreshFyleDimensions().subscribe();
    this.accountingExportService.importExpensesFromFyle('v1').subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from NetSuite');
  }

  private setupPage() {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

  ngOnInit(): void {
    this.setupPage();
  }


}
