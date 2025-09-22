import { Injectable } from '@angular/core';
import { concatMap, forkJoin, map, Observable } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { FyleField, AccountingField, QBDCorporateCreditCardExpensesObject, NameInJournalEntry, AccountingDisplayName } from 'src/app/core/models/enum/enum.model';
import { QbdDirectDestinationAttribute } from 'src/app/core/models/qbd-direct/db/qbd-direct-destination-attribuite.model';
import { QbdDirectExportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { QbdDirectImportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.service';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectMappingService {

  private destinationOptions: DestinationAttribute[] = [];

  private employeeFieldMapping: FyleField;

  private sourceField: string;

  private destinationField: string;

  private cccExpenseObject: QBDCorporateCreditCardExpensesObject | null;

  private displayName: string | undefined = undefined;

  private nameInJE: NameInJournalEntry;

  private chartOfAccounts: string[];

  private isImportItemsEnabled: boolean;

  private query: string | undefined;

  getDestinationField(): string {
    return this.destinationField;
  }

  getDestinationOptions(): DestinationAttribute[] {
    return this.destinationOptions;
  }

  getEmployeeFieldMapping(): FyleField {
    return this.employeeFieldMapping;
  }

  constructor(
    private mappingService: MappingService,
    private exportSettingService: QbdDirectExportSettingsService,
    private importSettingService: QbdDirectImportSettingsService
  ) { }

  private getDestinationFieldFromSettings(workspaceGeneralSetting: QbdDirectExportSettingGet, mappingSettings: MappingSetting[]): string {
    if (this.sourceField === FyleField.EMPLOYEE) {
      return workspaceGeneralSetting.employee_field_mapping;
    } else if (this.sourceField === FyleField.CATEGORY) {
      return AccountingField.ACCOUNT;
    }

    return mappingSettings.find((setting) => setting.source_field === this.sourceField)?.destination_field || '';
  }

  private fetchDestinationOptions(detailAccountType?: string[]): Observable<QbdDirectDestinationAttribute[]> {

    // When items are enabled for category mapping, make separate API calls
    if (this.isImportItemsEnabled && this.destinationField === AccountingField.ACCOUNT && this.sourceField === FyleField.CATEGORY) {
      return forkJoin([
        // Get Accounts with account type filters
        this.mappingService.getPaginatedDestinationAttributes(this.destinationField, this.query, AccountingDisplayName.ACCOUNT, '', detailAccountType),
        // Get Items without account type filters
        this.mappingService.getPaginatedDestinationAttributes(this.destinationField, this.query, AccountingDisplayName.ITEM, '', undefined)
      ]).pipe(
        map(([accountsResponse, itemsResponse]) => {
          // Combine accounts and items
          const accounts = accountsResponse.results as QbdDirectDestinationAttribute[];
          const items = itemsResponse.results as QbdDirectDestinationAttribute[];
          return [...accounts, ...items];
        })
      );
    }
    // Original single API call for other cases
    return this.mappingService.getPaginatedDestinationAttributes(this.destinationField, this.query, this.displayName, '', detailAccountType).pipe(
      map((responses) => {
        return responses.results as QbdDirectDestinationAttribute[];
      })
    );
  }

  private getCCCAccountOptions(): Observable<QbdDirectDestinationAttribute[]> {
    if (this.cccExpenseObject === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
      return this.fetchDestinationOptions(['CreditCard']);
    } else if (this.cccExpenseObject === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.employeeFieldMapping === FyleField.EMPLOYEE && this.nameInJE === NameInJournalEntry.EMPLOYEE) {
      return this.fetchDestinationOptions(['Bank', 'CreditCard', 'OtherCurrentLiability', 'LongTermLiability']);
    }
    return this.fetchDestinationOptions(['Bank', 'AccountsPayable', 'CreditCard', 'OtherCurrentLiability', 'LongTermLiability']);
  }

  private getAccountOptions(): Observable<QbdDirectDestinationAttribute[]> {
    return this.fetchDestinationOptions(this.chartOfAccounts);
  }

  fetchDestinationOptionsBySourceField(): Observable<QbdDirectDestinationAttribute[]> {
    if (this.sourceField === 'CORPORATE_CARD') {
      return this.getCCCAccountOptions();
    } else if (this.sourceField === 'CATEGORY') {
      return this.getAccountOptions();
    }
    // For all other source fields
    return this.fetchDestinationOptions();
  }

  updateDestinationOptions(query?: string) {
    this.query = query;
    return this.fetchDestinationOptionsBySourceField().pipe(
      map((options) => {
        for (const newOption of options) {
          if (!this.destinationOptions.find((existingOption) => existingOption.id === newOption.id)) {
            this.destinationOptions.push(newOption);
          }
        }
        this.destinationOptions.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
      })
    );
  }

  initialize(sourceField: string) {
    this.sourceField = sourceField;
    return forkJoin([
      this.exportSettingService.getQbdExportSettings(),
      this.importSettingService.getImportSettings(),
      this.mappingService.getMappingSettings()
    ]).pipe(
      concatMap((responses) => {
        this.cccExpenseObject = responses[0].credit_card_expense_export_type;
        this.employeeFieldMapping = (responses[0].employee_field_mapping as unknown as FyleField);
        this.nameInJE = responses[0].name_in_journal_entry;

        // Extract items setting
        this.isImportItemsEnabled = responses[1].import_settings.import_item_as_category;
        this.chartOfAccounts = responses[1].import_settings.import_account_as_category ? responses[1].import_settings.chart_of_accounts.map((item: string) => item.replace(/\s+/g, '')) : this.importSettingService.getChartOfAccountTypesList().map((item: string) => item.replace(/\s+/g, ''));
        this.destinationField = this.getDestinationFieldFromSettings(responses[0], responses[2].results);

        return this.updateDestinationOptions();
      })
    );
  }
}
