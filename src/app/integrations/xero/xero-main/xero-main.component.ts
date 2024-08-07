import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';

@Component({
  selector: 'app-xero-main',
  templateUrl: './xero-main.component.html',
  styleUrls: ['./xero-main.component.scss']
})
export class XeroMainComponent implements OnInit {

  appName: AppName = AppName.XERO;

  readonly brandingContent = brandingContent.common;

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/xero/main/dashboard'},
    {label: this.brandingContent.exportLogTabName, routerLink: '/integrations/xero/main/export_log'},
    {label: 'Mapping', routerLink: '/integrations/xero/main/mapping'},
    {label: 'Configuration', routerLink: '/integrations/xero/main/configuration'}
  ];

  activeModule: MenuItem;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private accountingExportService: AccountingExportService,
    private xeroHelperService: XeroHelperService,
    private router: Router
  ) { }

  refreshDimensions() {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
    this.xeroHelperService.refreshFyleDimensions().subscribe();
    this.accountingExportService.importExpensesFromFyle('v1').subscribe();
  }

  private setupPage() {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
