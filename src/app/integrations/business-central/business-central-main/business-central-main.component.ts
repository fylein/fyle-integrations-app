import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';

@Component({
  selector: 'app-business-central-main',
  templateUrl: './business-central-main.component.html',
  styleUrls: ['./business-central-main.component.scss']
})
export class BusinessCentralMainComponent implements OnInit {

  appName: AppName = AppName.BUSINESS_CENTRAL;

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/business_central/main/dashboard'},
    {label: 'Export Log', routerLink: '/integrations/business_central/main/export_log'},
    {label: 'Mapping', routerLink: '/integrations/business_central/main/mapping'},
    {label: 'Configuration', routerLink: '/integrations/business_central/main/configuration/export_settings'}
  ];

  activeModule: MenuItem;

  constructor(
    private accountingExportService: AccountingExportService,
    private router: Router,
    private helperService: BusinessCentralHelperService
  ) { }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
    this.accountingExportService.importExpensesFromFyle().subscribe();
  }

  private setupPage() {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
