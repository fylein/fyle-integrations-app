import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppName, FyleField } from 'src/app/core/models/enum/enum.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { Sage50HelperService } from 'src/app/core/services/sage50/sage50-helper/sage50-helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50CCCExportType, Sage50ReimbursableExportType } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { forkJoin } from 'rxjs';

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
    private mappingService: MappingService,
    private exportSettingsService: Sage50ExportSettingsService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.mappingService.getMappingSettings(),
      this.exportSettingsService.getExportSettings()
    ]).subscribe(([mappingSettings, exportSettings]) => {
      let hasMappings = false;

      if (exportSettings?.reimbursable_expense_export_type === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY) {
        hasMappings = true;
      }

      if (exportSettings?.credit_card_expense_export_type === Sage50CCCExportType.PAYMENTS_JOURNAL) {
        hasMappings = true;
      }

      if (mappingSettings.results && Array.isArray(mappingSettings.results)) {
        const hasCustomFields = mappingSettings.results.some(
          (item) => item.source_field !== FyleField.EMPLOYEE &&
                    item.source_field !== FyleField.CATEGORY &&
                    item.source_field !== FyleField.CORPORATE_CARD
        );
        if (hasCustomFields) {
          hasMappings = true;
        }
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

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
    this.accountingExportService.importExpensesFromFyle().subscribe();
  }
}

