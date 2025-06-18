import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-business-central-main',
  templateUrl: './business-central-main.component.html',
  styleUrls: ['./business-central-main.component.scss']
})
export class BusinessCentralMainComponent {

  appName: AppName = AppName.BUSINESS_CENTRAL;

  modules: MenuItem[];

  constructor(
    private accountingExportService: AccountingExportService,
    private helperService: BusinessCentralHelperService,
    private translocoService: TranslocoService
  ) { 
    this.modules = [
      {label: this.translocoService.translate('businessCentralMain.dashboard'), routerLink: '/integrations/business_central/main/dashboard'},
      {label: this.translocoService.translate('businessCentralMain.exportLog'), routerLink: '/integrations/business_central/main/export_log'},
      {label: this.translocoService.translate('businessCentralMain.mapping'), routerLink: '/integrations/business_central/main/mapping'},
      {label: this.translocoService.translate('businessCentralMain.configuration'), routerLink: '/integrations/business_central/main/configuration/export_settings'}
    ];
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
    this.accountingExportService.importExpensesFromFyle().subscribe();
  }
}
