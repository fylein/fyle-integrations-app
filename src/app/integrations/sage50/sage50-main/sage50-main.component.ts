import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50CCCExportType, Sage50ReimbursableExportType } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';

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
    private exportSettingsService: Sage50ExportSettingsService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {

      this.exportSettingsService.getExportSettings().subscribe((exportSettings) => {
      let hasMappings = false;

      if (exportSettings?.reimbursable_expense_export_type === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY || exportSettings?.credit_card_expense_export_type === Sage50CCCExportType.PAYMENTS_JOURNAL) {
        hasMappings = true;
      }

      this.modules = [
        {label: this.translocoService.translate('sage50Main.dashboard'), routerLink: '/integrations/sage50/main/dashboard'}
      ];

      if (hasMappings) {
        this.modules.push({
          label: this.translocoService.translate('sage50Main.mapping'),
          routerLink: '/integrations/sage50/main/mapping'
        });
      }

      this.modules.push({
        label: this.translocoService.translate('sage50Main.configuration'),
        routerLink: '/integrations/sage50/main/configuration'
      });
    });
  }

  refreshDimensions() {
    this.accountingExportService.importExpensesFromFyle().subscribe();
  }
}
