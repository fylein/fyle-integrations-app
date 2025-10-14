import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { Sage50HelperService } from 'src/app/core/services/sage50/sage50-helper/sage50-helper.service';

@Component({
  selector: 'app-sage50-main',
  standalone: true,
  imports: [SharedModule, RouterOutlet],
  templateUrl: './sage50-main.component.html',
  styleUrls: ['./sage50-main.component.scss']
})
export class Sage50MainComponent implements OnInit {

  appName: AppName = AppName.SAGE50;

  modules: MenuItem[] = [];

  constructor(
    private accountingExportService: AccountingExportService,
    private helperService: Sage50HelperService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('sage50Main.dashboard'), routerLink: '/integrations/sage50/main/dashboard'},
      {label: this.translocoService.translate('sage50Main.mapping'), routerLink: '/integrations/sage50/main/mapping'},
      {label: this.translocoService.translate('sage50Main.configuration'), routerLink: '/integrations/sage50/main/configuration'}
    ];
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
    this.accountingExportService.importExpensesFromFyle().subscribe();
  }
}

