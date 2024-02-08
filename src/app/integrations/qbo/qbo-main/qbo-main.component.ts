import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';

@Component({
  selector: 'app-qbo-main',
  templateUrl: './qbo-main.component.html',
  styleUrls: ['./qbo-main.component.scss']
})
export class QboMainComponent implements OnInit {

  appName: AppName = AppName.QBO;

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/qbo/main/dashboard'},
    {label: 'Export Log', routerLink: '/integrations/qbo/main/export_log'},
    {label: 'Mapping', routerLink: '/integrations/qbo/main/mapping'},
    {label: 'Configuration', routerLink: '/integrations/qbo/main/configuration'}
  ];

  activeModule: MenuItem;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private accountingExportService: AccountingExportService,
    private qboHelperService: QboHelperService,
    private router: Router
  ) { }

  refreshDimensions() {
    this.qboHelperService.refreshQBODimensions().subscribe();
    this.qboHelperService.refreshFyleDimensions().subscribe();
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
