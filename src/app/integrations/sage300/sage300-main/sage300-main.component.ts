import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-sage300-main',
    templateUrl: './sage300-main.component.html',
    styleUrls: ['./sage300-main.component.scss'],
    standalone: false
})
export class Sage300MainComponent {

  appName: AppName = AppName.SAGE300;

  modules: MenuItem[];

  constructor(
    private accountingExportService: AccountingExportService,
    private helperService: Sage300HelperService,
    private translocoService: TranslocoService
  ) {
    this.modules = [
      {label: this.translocoService.translate('sage300Main.dashboard'), routerLink: '/integrations/sage300/main/dashboard'},
      {label: this.translocoService.translate('sage300Main.exportLog'), routerLink: '/integrations/sage300/main/export_log'},
      {label: this.translocoService.translate('sage300Main.mapping'), routerLink: '/integrations/sage300/main/mapping'},
      {label: this.translocoService.translate('sage300Main.configuration'), routerLink: '/integrations/sage300/main/configuration'}
    ];
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
    this.accountingExportService.importExpensesFromFyle().subscribe();
  }
}
