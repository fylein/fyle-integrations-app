import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';

@Component({
  selector: 'app-sage300-main',
  templateUrl: './sage300-main.component.html',
  styleUrls: ['./sage300-main.component.scss']
})
export class Sage300MainComponent implements OnInit {

  appName: AppName = AppName.SAGE300;

  modules: MenuItem[] = [
    {label: 'Dashboard', routerLink: '/integrations/sage300/main/dashboard'},
    {label: 'Export Log', routerLink: '/integrations/sage300/main/export_log'},
    {label: 'Mapping', routerLink: '/integrations/sage300/main/mapping'},
    {label: 'Configuration', routerLink: '/integrations/sage300/main/configuration'}
  ];

  activeModule: MenuItem;

  constructor(
    private accountingExportService: AccountingExportService,
    private router: Router,
    private helperService: Sage300HelperService
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
