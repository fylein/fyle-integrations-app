import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/c1-contents-config';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { FyleField, AppName, AccountingField, QBDReimbursableExpensesObject, QBDCorporateCreditCardExpensesObject, NameInJournalEntry } from 'src/app/core/models/enum/enum.model';
import { QbdDirectDestinationAttribute } from 'src/app/core/models/qbd-direct/db/qbd-direct-destination-attribuite.model';
import { QbdDirectExportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { QbdDirectImportSettingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { QbdDirectImportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-base-mapping',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './qbd-direct-base-mapping.component.html',
  styleUrl: './qbd-direct-base-mapping.component.scss'
})
export class QbdDirectBaseMappingComponent implements OnInit {

  isLoading: boolean = true;

  destinationOptions: DestinationAttribute[];

  employeeFieldMapping: FyleField;

  sourceField: string;

  destinationField: string;

  reimbursableExpenseObject: QBDReimbursableExpensesObject | null;

  cccExpenseObject: QBDCorporateCreditCardExpensesObject | null;

  AppName = AppName;

  FyleField = FyleField;

  displayName: string | undefined = undefined;

  isMultiLineOption: boolean;

  brandingConfig = brandingConfig;

  nameInJE: NameInJournalEntry;

  chartOfAccounts: string[];

  detailAccountType: string[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private exportSettingService: QbdDirectExportSettingsService,
    private importSettingService: QbdDirectImportSettingsService
  ) { }

  private getDestinationField(workspaceGeneralSetting: QbdDirectExportSettingGet, mappingSettings: MappingSetting[]): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return workspaceGeneralSetting.employee_field_mapping;
    } else if (this.sourceField === FyleField.CATEGORY) {
      return AccountingField.ACCOUNT;
    }

    return mappingSettings.find((setting) => setting.source_field === this.sourceField)?.destination_field || '';
  }

  destinationOptionsWatcher(detailAccountType?: string[]): void {
    this.detailAccountType = detailAccountType;
    this.mappingService.getPaginatedDestinationAttributes(this.destinationField, undefined, this.displayName, '', detailAccountType).subscribe((responses) => {
      this.destinationOptions = responses.results as QbdDirectDestinationAttribute[];
      this.isLoading = false;
    });
  }

  getCCCAccountOptions(): void {
    if (this.cccExpenseObject === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
      this.destinationOptionsWatcher(['CreditCard']);
    } else if (this.cccExpenseObject === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.employeeFieldMapping === FyleField.EMPLOYEE && this.nameInJE === NameInJournalEntry.EMPLOYEE) {
      this.destinationOptionsWatcher(['Bank', 'CreditCard', 'OtherCurrentLiability', 'LongTermLiability']);
    } else {
      this.destinationOptionsWatcher(['Bank', 'AccountsPayable', 'CreditCard', 'OtherCurrentLiability', 'LongTermLiability']);
    }
  }

  getAccountOptions(): void {
    this.destinationOptionsWatcher(this.chartOfAccounts);
  }

  private setupPage(): void {
    this.sourceField = decodeURIComponent(this.route.snapshot.params.source_field.toUpperCase());
    forkJoin([
      this.exportSettingService.getQbdExportSettings(),
      this.importSettingService.getImportSettings(),
      this.mappingService.getMappingSettings()
    ]).subscribe((responses) => {
      this.reimbursableExpenseObject = responses[0].reimbursable_expense_export_type;
      this.cccExpenseObject = responses[0].credit_card_expense_export_type;
      this.employeeFieldMapping = (responses[0].employee_field_mapping as unknown as FyleField);
      this.nameInJE = responses[0].name_in_journal_entry;
      this.chartOfAccounts = responses[1].import_settings.import_account_as_category ? responses[1].import_settings.chart_of_accounts : QbdDirectImportSettingModel.getChartOfAccountTypesList();

      this.destinationField = this.getDestinationField(responses[0], responses[2].results);

      if (this.sourceField === 'CORPORATE_CARD') {
        this.getCCCAccountOptions();
      } else if (this.sourceField === 'CATEGORY') {
        this.getAccountOptions();
      } else {
        this.destinationOptionsWatcher();
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.setupPage();
    });
  }

}
