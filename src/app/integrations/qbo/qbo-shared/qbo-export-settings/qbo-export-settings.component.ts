import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, concat, debounceTime, filter, forkJoin, of } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExportDateType, FundSource, FyleField, QBOCorporateCreditCardExpensesObject, QBOOnboardingState, QBOReimbursableExpensesObject, QboExportSettingDestinationOptionKey, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { QBOExportSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
// Add to existing imports
import { QBOEmployeeSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { QboEmployeeSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-employee-settings.service';
import { TranslocoService } from '@jsverse/transloco';
import { EmployeeSettingsService } from 'src/app/core/services/common/employee-settings.service';
import { ExportSettingsService } from 'src/app/core/services/common/export-settings.service';
import { BrandingService } from 'src/app/core/services/common/branding.service';

@Component({
  selector: 'app-qbo-export-settings',
  templateUrl: './qbo-export-settings.component.html',
  styleUrls: ['./qbo-export-settings.component.scss']
})
export class QboExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.QBO.EXPORT_SETTING;

  brandingConfig = brandingConfig;

  isOnboarding: boolean;

  windowReference: Window;

  exportSettings: QBOExportSettingGet;

  employeeFieldMapping: EmployeeFieldMapping;

  bankAccounts: DefaultDestinationAttribute[];

  bankAndLiabilityAccounts: DefaultDestinationAttribute[];

  cccAccounts: DefaultDestinationAttribute[];

  accountsPayables: DefaultDestinationAttribute[];

  vendors: DefaultDestinationAttribute[];

  expenseAccounts: DefaultDestinationAttribute[];

  isImportItemsEnabled: boolean;

  creditCardExportTypes: SelectFormOption[] = [];

  cccExpenseStateOptions: SelectFormOption[] = [];

  expenseStateOptions: SelectFormOption[] = [];

  expenseGroupByOptions: SelectFormOption[] = [];

  reimbursableExpenseGroupingDateOptions: SelectFormOption[] = [];

  cccExpenseGroupingDateOptions: SelectFormOption[] = [];

  nameInJournalOptions: SelectFormOption[] = [];

  showNameInJournalOption: boolean;

  exportSettingForm: FormGroup;

  isSaveInProgress: boolean;

  isConfirmationDialogVisible: boolean;

  warningDialogText: string;

  appName: AppName = AppName.QBO;

  QBOCorporateCreditCardExpensesObject = QBOCorporateCreditCardExpensesObject;

  QBOReimbursableExpensesObject = QBOReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  splitExpenseGroupingOptions: SelectFormOption[] = [];

  isOptionSearchInProgress: boolean;

  private optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  QboExportSettingDestinationOptionKey = QboExportSettingDestinationOptionKey;

  previewImagePaths =[
    {
      [QBOReimbursableExpensesObject.EXPENSE]: 'assets/pngs/preview-screens/qbo-reimburse-expense.png',
      [QBOReimbursableExpensesObject.BILL]: 'assets/pngs/preview-screens/qbo-reimburse-bill.png',
      [QBOReimbursableExpensesObject.JOURNAL_ENTRY]: 'assets/pngs/preview-screens/qbo-reimburse-journal-entry.png',
      [QBOReimbursableExpensesObject.CHECK]: 'assets/pngs/preview-screens/qbo-reimburse-check.png'
    },
    {
      [QBOCorporateCreditCardExpensesObject.BILL]: 'assets/pngs/preview-screens/qbo-ccc-bill.png',
      [QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE]: 'assets/pngs/preview-screens/qbo-ccc-expense.png',
      [QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: 'assets/pngs/preview-screens/qbo-ccc-journal-entry.png',
      [QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE]: 'assets/pngs/preview-screens/qbo-ccc-debit-card.png'
    }
  ];

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  isMultilineOption: boolean;

  // Employee settings
  employeeSettingForm: FormGroup;

  employeeMappingOptions: SelectFormOption[] = [];

  autoMapEmployeeOptions: SelectFormOption[] = [];

  employeeSetting: QBOEmployeeSettingGet;

  existingEmployeeFieldMapping: EmployeeFieldMapping;

  liveEntityExample: {[FyleField.EMPLOYEE]: string | undefined, [FyleField.VENDOR]: string | undefined};

  readonly brandingStyle = brandingStyle;

  constructor(
    private translocoService: TranslocoService,
    public helperService: HelperService,
    private qboHelperService: QboHelperService,
    private mappingService: MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService,
    private employeeSettingService: QboEmployeeSettingsService,
    private qboExportSettingsService: QboExportSettingsService,
    private employeeSettingsService: EmployeeSettingsService,
    private qboEmployeeSettingsService: QboEmployeeSettingsService,
    public brandingService: BrandingService
  ) {
    this.windowReference = this.windowService.nativeWindow;
    this.reimbursableExpenseGroupingDateOptions = this.qboExportSettingsService.getReimbursableExpenseGroupingDateOptions();
    this.creditCardExportTypes = this.qboExportSettingsService.getCreditCardExportTypes();
    this.cccExpenseStateOptions = this.qboExportSettingsService.getCCCExpenseStateOptions();
    this.expenseStateOptions = this.qboExportSettingsService.getReimbursableExpenseStateOptions();
    this.expenseGroupByOptions = this.qboExportSettingsService.getExpenseGroupByOptions();
    this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();
    this.nameInJournalOptions = this.qboExportSettingsService.getNameInJournalOptions();
    this.splitExpenseGroupingOptions = this.qboExportSettingsService.getSplitExpenseGroupingOptions();
    this.employeeMappingOptions = this.employeeSettingsService.getEmployeeFieldMappingOptions();
    this.autoMapEmployeeOptions = this.qboEmployeeSettingsService.getAutoMapEmployeeOptions();
  }

  isEmployeeMappingDisabled(): boolean {
    const exportType = this.exportSettingForm.get('reimbursableExportType')?.value;
    return exportType === QBOReimbursableExpensesObject.BILL ||
           exportType === QBOReimbursableExpensesObject.CHECK;
  }

  setupExportTypeWatcher(): void {
    this.exportSettingForm.get('reimbursableExportType')?.valueChanges.subscribe((exportType) => {
      const employeeMappingControl = this.employeeSettingForm.get('employeeMapping');

      if (exportType === QBOReimbursableExpensesObject.BILL) {
        employeeMappingControl?.patchValue(EmployeeFieldMapping.VENDOR);
        employeeMappingControl?.disable();
      } else if (exportType === QBOReimbursableExpensesObject.CHECK) {
        employeeMappingControl?.patchValue(EmployeeFieldMapping.EMPLOYEE);
        employeeMappingControl?.disable();
      } else if (exportType === QBOReimbursableExpensesObject.EXPENSE) {
        employeeMappingControl?.enable();
      } else if (exportType === QBOReimbursableExpensesObject.JOURNAL_ENTRY) {
        employeeMappingControl?.enable();
      }
    });
  }

  getAllReimbursableExportTypeOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('qboExportSettings.reimbursableExportTypeCheck'),
        value: QBOReimbursableExpensesObject.CHECK
      },
      {
        label: this.translocoService.translate('qboExportSettings.reimbursableExportTypeBill'),
        value: QBOReimbursableExpensesObject.BILL
      },
      {
        label: this.translocoService.translate('qboExportSettings.reimbursableExportTypeExpense'),
        value: QBOReimbursableExpensesObject.EXPENSE
      },
      {
        label: this.translocoService.translate('qboExportSettings.reimbursableExportTypeJournalEntry'),
        value: QBOReimbursableExpensesObject.JOURNAL_ENTRY
      }
    ];
  }

  constructPayloadAndSave(data: ConfigurationWarningOut): void {
    this.isConfirmationDialogVisible = false;
    if (data.hasAccepted) {
      this.isSaveInProgress = true;
      const exportSettingPayload = QboExportSettingsService.constructPayload(this.exportSettingForm);
      const employeeSettingPayload = QboEmployeeSettingsService.constructPayload(this.employeeSettingForm);

      concat(
        this.employeeSettingService.postEmployeeSettings(employeeSettingPayload),
        this.qboExportSettingsService.postExportSettings(exportSettingPayload)
      ).subscribe({
        complete: () => {
          this.isSaveInProgress = false;
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qboExportSettings.exportSettingsSuccess'), undefined, this.isOnboarding);
          if (this.isOnboarding) {
            this.workspaceService.setOnboardingState(QBOOnboardingState.IMPORT_SETTINGS);
            this.router.navigate([`/integrations/qbo/onboarding/import_settings`]);
        } else if (this.isAdvancedSettingAffected()) {
          this.router.navigate(['/integrations/qbo/main/configuration/advanced_settings']);
          }
        },
        error: () => {
          this.isSaveInProgress = false;
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qboExportSettings.exportSettingsError'));
        }
      });
    }
  }

  private setLiveEntityExample(destinationAttributes: DestinationAttribute[]): void {
    this.liveEntityExample = {
      [FyleField.EMPLOYEE]: destinationAttributes.find((attribute: DestinationAttribute) => attribute.attribute_type === FyleField.EMPLOYEE)?.value,
      [FyleField.VENDOR]: destinationAttributes.find((attribute: DestinationAttribute) => attribute.attribute_type === FyleField.VENDOR)?.value
    };
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbo/onboarding/connector`]);
  }

  refreshDimensions() {
    this.qboHelperService.refreshQBODimensions().subscribe();
  }

  save(): void {
    if (this.isAdvancedSettingAffected()) {
      this.warningDialogText = this.constructWarningMessage();
      this.isConfirmationDialogVisible = true;
      return;
    }

    this.constructPayloadAndSave({hasAccepted: true, event: ConfigurationWarningEvent.QBO_EXPORT_SETTINGS});
  }

  private replaceContentBasedOnConfiguration(updatedConfiguration: string, existingConfiguration: string, exportType: 'reimbursable' | 'credit card'): string {
    const translatedExportType = this.translocoService.translate(`qboExportSettings.${exportType.replace(' ', '')}ExpenseType`);
    const configurationUpdate = this.translocoService.translate('qboExportSettings.configurationUpdateWarning', { exportType: translatedExportType, existingExportType: existingConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()), updatedExportType: updatedConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()) });
    const newConfiguration = this.translocoService.translate('qboExportSettings.newConfigurationWarning', { exportType: translatedExportType });

    let content = '';
    // If both are not none and it is an update case else for the new addition case
    if (updatedConfiguration !== 'None' && existingConfiguration !== 'None') {
      content = configurationUpdate;
    } else {
      content = newConfiguration;
    }

    // If any export-type has been changed to journal entry and has import_items set to true, then add the below content and return
    if ((updatedConfiguration === QBOReimbursableExpensesObject.JOURNAL_ENTRY) && this.isImportItemsEnabled) {
      return `${content} ${this.translocoService.translate('qboExportSettings.productsServicesWarning', { brandName: brandingConfig.brandName })}`;
    }
    // If any export-type is not journal entry or import_items is set to false, simply return the normal constructed content
    return content;
  }

  private constructWarningMessage(): string {
    let content: string = '';
    const existingReimbursableExportType = this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? this.exportSettings.workspace_general_settings.reimbursable_expenses_object : 'None';
    const existingCorporateCardExportType = this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object : 'None';
    const updatedReimbursableExportType = this.exportSettingForm.get('reimbursableExportType')?.value ? this.exportSettingForm.get('reimbursableExportType')?.value : 'None';
    const updatedCorporateCardExportType = this.exportSettingForm.get('creditCardExportType')?.value ? this.exportSettingForm.get('creditCardExportType')?.value : 'None';

    if (this.isSingleItemizedJournalEntryAffected()) {
      if (updatedReimbursableExportType !== existingReimbursableExportType) {
        content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, this.translocoService.translate('qboExportSettings.reimbursableExpenseType'));
      } else if (existingCorporateCardExportType !== updatedCorporateCardExportType) {
        content = this.replaceContentBasedOnConfiguration(updatedCorporateCardExportType, existingCorporateCardExportType, this.translocoService.translate('qboExportSettings.creditCardExpenseType'));
      }
    }

    if (!this.isSingleItemizedJournalEntryAffected() && this.isPaymentsSyncAffected()) {
      content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, this.translocoService.translate('qboExportSettings.reimbursableExpenseType'));
    }

    return content;
  }

  private isExportSettingsUpdated(): boolean {
    return this.exportSettings.workspace_general_settings?.reimbursable_expenses_object !== null || this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object !== null;
  }

  private isSingleItemizedJournalEntryAffected(): boolean {
    return (this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== QBOReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.get('reimbursableExportType')?.value === QBOReimbursableExpensesObject.JOURNAL_ENTRY) || (this.exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object !== QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.get('creditCardExportType')?.value === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
  }

  private isPaymentsSyncAffected(): boolean {
    return this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== QBOReimbursableExpensesObject.BILL && this.exportSettingForm.get('reimbursableExportType')?.value  === QBOReimbursableExpensesObject.BILL;
  }

  private isAdvancedSettingAffected(): boolean {
    if (this.isExportSettingsUpdated() && (this.isSingleItemizedJournalEntryAffected() || this.isPaymentsSyncAffected())) {
      return true;
    }

    return false;
  }

  private updateCCCExpenseGroupingDateOptions(selectedValue: QBOCorporateCreditCardExpensesObject): void {
    if ([QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE, QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE].includes(selectedValue)) {
      this.exportSettingForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
      this.exportSettingForm.controls.creditCardExportGroup.disable();
      this.cccExpenseGroupingDateOptions = this.qboExportSettingsService.constructExportDateOptions(true, this.exportSettingForm.controls.creditCardExportGroup.value, this.exportSettingForm.controls.creditCardExportDate.value);
    } else {
      this.cccExpenseGroupingDateOptions = this.qboExportSettingsService.constructExportDateOptions(false, this.exportSettingForm.controls.creditCardExportGroup.value, this.exportSettingForm.controls.creditCardExportDate.value);
      this.helperService.enableFormField(this.exportSettingForm, 'creditCardExportGroup');
    }
  }

  private setupCustomWatchers(): void {
    if (this.exportSettingForm.get('creditCardExportType')?.value && [QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE, QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE].includes(this.exportSettingForm.get('creditCardExportType')?.value)) {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.get('creditCardExportType')?.value);
    }

    this.qboExportSettingsService.creditCardExportTypeChange.subscribe((selectedValue: QBOCorporateCreditCardExpensesObject) => {
      this.showNameInJournalOption = selectedValue === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.updateCCCExpenseGroupingDateOptions(selectedValue);
    });
  }

  private setupCustomDateOptionWatchers(): void {

    this.exportSettingForm.controls.reimbursableExportGroup?.valueChanges.subscribe((reimbursableExportGroup) => {
      this.reimbursableExpenseGroupingDateOptions = this.qboExportSettingsService.constructExportDateOptions(false, reimbursableExportGroup, this.exportSettingForm.controls.reimbursableExportDate.value);

      this.qboExportSettingsService.clearInvalidDateOption(
        this.exportSettingForm.get('reimbursableExportDate'),
        this.reimbursableExpenseGroupingDateOptions
      );
    });

    this.exportSettingForm.controls.creditCardExportGroup?.valueChanges.subscribe((creditCardExportGroup) => {

      // In QBO, credit card purchase and 'debit & credit card expense' are core modules
      // (Card transaction post date is available for these modules)
      const isCoreCCCModule = [
        QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE,
        QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE
      ].includes(this.exportSettingForm.get('creditCardExportType')?.value);

      this.cccExpenseGroupingDateOptions = this.qboExportSettingsService.constructExportDateOptions(
        isCoreCCCModule, creditCardExportGroup, this.exportSettingForm.controls.creditCardExportDate.value
      );

      this.qboExportSettingsService.clearInvalidDateOption(
        this.exportSettingForm.get('creditCardExportDate'),
        this.cccExpenseGroupingDateOptions
      );
    });
  }


  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event: ExportSettingOptionSearch) => {
      this.handleOptionSearch(event);
    });
  }

  private handleOptionSearch(event: ExportSettingOptionSearch): void {
    const existingOptions = this.getExistingOptions(event.destinationOptionKey as QboExportSettingDestinationOptionKey);

    if (event.destinationOptionKey === QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT || event.destinationOptionKey === QboExportSettingDestinationOptionKey.BANK_ACCOUNT_AND_CREDIT_CARD_ACCOUNT) {
      this.handleExpenseAccountSearch(event, existingOptions);
    } else {
      this.handleGeneralOptionSearch(event, existingOptions);
    }
  }

  private getExistingOptions(destinationOptionKey: QboExportSettingDestinationOptionKey): DefaultDestinationAttribute[] {
    switch (destinationOptionKey) {
      case QboExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE:
        return this.accountsPayables;
      case QboExportSettingDestinationOptionKey.BANK_ACCOUNT:
        return this.bankAccounts;
      case QboExportSettingDestinationOptionKey.BANK_ACCOUNT_AND_LIABILITY_ACCOUNT:
        return this.bankAndLiabilityAccounts;
      case QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT:
        return this.cccAccounts;
      case QboExportSettingDestinationOptionKey.VENDOR:
        return this.vendors;
      case QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT:
        return this.expenseAccounts;
      case QboExportSettingDestinationOptionKey.BANK_ACCOUNT_AND_CREDIT_CARD_ACCOUNT:
        return this.expenseAccounts;
      default:
        return [];
    }
  }

  private handleExpenseAccountSearch(event: ExportSettingOptionSearch, existingOptions: DefaultDestinationAttribute[]): void {
    forkJoin([
      this.getPaginatedAttributes(QboExportSettingDestinationOptionKey.BANK_ACCOUNT, event.searchTerm),
      this.getPaginatedAttributes(QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT, event.searchTerm)
    ]).subscribe(([bankAccounts, cccAccounts]) => {
      const expenseAccounts = bankAccounts.results.concat(cccAccounts.results);
      this.updateOptions(event.destinationOptionKey as QboExportSettingDestinationOptionKey, expenseAccounts, existingOptions);
    });
  }

  private handleGeneralOptionSearch(event: ExportSettingOptionSearch, existingOptions: DefaultDestinationAttribute[]): void {
    this.getPaginatedAttributes(event.destinationOptionKey as QboExportSettingDestinationOptionKey, event.searchTerm).subscribe((response) => {
      this.updateOptions(event.destinationOptionKey as QboExportSettingDestinationOptionKey, response.results, existingOptions);
    });
  }

  private getPaginatedAttributes(destinationOptionKey: QboExportSettingDestinationOptionKey, searchTerm: string): Observable<any> {
    return this.mappingService.getPaginatedDestinationAttributes(destinationOptionKey, searchTerm)
      .pipe(filter(response => !!response));
  }

  private updateOptions(destinationOptionKey: QboExportSettingDestinationOptionKey, newResults: any[], existingOptions: DefaultDestinationAttribute[]): void {
    if (destinationOptionKey === QboExportSettingDestinationOptionKey.BANK_ACCOUNT && this.exportSettingForm.get('reimbursableExportType')?.value !== QBOReimbursableExpensesObject.JOURNAL_ENTRY) {
      newResults = newResults.filter((option) => option.detail?.account_type === 'Bank');
    }

    const newOptions = newResults.map(this.qboExportSettingsService.formatGeneralMappingPayload);
    const updatedOptions = this.mergeOptions(existingOptions, newOptions);
    this.setUpdatedOptions(destinationOptionKey as QboExportSettingDestinationOptionKey, updatedOptions);
    this.isOptionSearchInProgress = false;
  }

  private mergeOptions(existingOptions: DefaultDestinationAttribute[], newOptions: DefaultDestinationAttribute[]): DefaultDestinationAttribute[] {
    newOptions.forEach((option) => {
      if (!existingOptions.find((existingOption) => existingOption.id === option.id)) {
        existingOptions.push(option);
      }
    });
    return existingOptions.concat().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  private setUpdatedOptions(destinationOptionKey: QboExportSettingDestinationOptionKey, updatedOptions: DefaultDestinationAttribute[]): void {
    switch (destinationOptionKey) {
      case QboExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE:
        this.accountsPayables = updatedOptions;
        break;
      case QboExportSettingDestinationOptionKey.BANK_ACCOUNT:
        this.bankAccounts = updatedOptions;
        break;
      case QboExportSettingDestinationOptionKey.BANK_ACCOUNT_AND_LIABILITY_ACCOUNT:
        this.bankAndLiabilityAccounts = updatedOptions;
        break;
      case QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT:
        this.cccAccounts = updatedOptions;
        break;
      case QboExportSettingDestinationOptionKey.VENDOR:
        this.vendors = updatedOptions;
        break;
      case QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT:
        this.expenseAccounts = updatedOptions;
        break;
      case QboExportSettingDestinationOptionKey.BANK_ACCOUNT_AND_CREDIT_CARD_ACCOUNT:
        this.expenseAccounts = updatedOptions;
        break;
    }
  }

  searchOptionsDropdown(event: ExportSettingOptionSearch): void {
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchUpdate.next(event);
    }
  }

  private addMissingOptions() {
    if (this.exportSettings.general_mappings) {
      // Since pagination call doesn't return all results for options, we're making use of the export settings API to fill in options
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.bankAccounts, newOption: this.exportSettings.general_mappings.bank_account});
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.expenseAccounts, newOption: this.exportSettings.general_mappings.qbo_expense_account});
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.accountsPayables, newOption: this.exportSettings.general_mappings.accounts_payable});

      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.cccAccounts, newOption: this.exportSettings.general_mappings.default_ccc_account});
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.expenseAccounts, newOption: this.exportSettings.general_mappings.default_debit_card_account});
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.vendors, newOption: this.exportSettings.general_mappings.default_ccc_vendor});
    }
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];

    const groupedAttributes: Observable<PaginatedDestinationAttribute>[]= [];

    destinationAttributes.forEach((destinationAttribute) => {
      groupedAttributes.push(this.mappingService.getPaginatedDestinationAttributes(destinationAttribute).pipe(filter(response => !!response)));
    });

    forkJoin([
      this.qboExportSettingsService.getExportSettings(),
      this.workspaceService.getWorkspaceGeneralSettings().pipe(catchError(() => of(null))),
      this.employeeSettingService.getDistinctQBODestinationAttributes([FyleField.EMPLOYEE, FyleField.VENDOR]),
      ...groupedAttributes
    ]).subscribe(([exportSetting, workspaceGeneralSettings, destinationAttributes, bankAccounts, cccAccounts, accountsPayables, vendors]) => {

      this.exportSettings = exportSetting;
      this.employeeFieldMapping = workspaceGeneralSettings?.employee_field_mapping;
      this.setLiveEntityExample(destinationAttributes);

      this.bankAndLiabilityAccounts = bankAccounts.results.map((option) => this.qboExportSettingsService.formatGeneralMappingPayload(option));

      const bankAccountOptions = bankAccounts.results.filter((option) => option.detail?.account_type === 'Bank');
      this.bankAccounts = bankAccountOptions.map((option) => this.qboExportSettingsService.formatGeneralMappingPayload(option));

      this.cccAccounts = cccAccounts.results.map((option) => this.qboExportSettingsService.formatGeneralMappingPayload(option));
      this.accountsPayables = accountsPayables.results.map((option) => this.qboExportSettingsService.formatGeneralMappingPayload(option));
      this.vendors = vendors.results.map((option) => this.qboExportSettingsService.formatGeneralMappingPayload(option));
      this.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);
      this.isImportItemsEnabled = workspaceGeneralSettings?.import_items || false;
      this.showNameInJournalOption = this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.addMissingOptions();
      this.exportSettingForm = this.qboExportSettingsService.mapAPIResponseToFormGroup(this.exportSettings, this.employeeFieldMapping);
      this.employeeSettingForm = QboExportSettingsService.createEmployeeSettingsForm(
        this.employeeFieldMapping,
        workspaceGeneralSettings?.auto_map_employees || false
      );
      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);

      const [exportSettingValidatorRule, exportModuleRule] = QboExportSettingsService.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      const employeeMappingControl = this.employeeSettingForm.get('employeeMapping');
      if (this.exportSettings.workspace_general_settings?.reimbursable_expenses_object) {
        this.qboExportSettingsService.setupDynamicValidators(this.exportSettingForm, employeeMappingControl, exportModuleRule[0], this.exportSettings.workspace_general_settings?.reimbursable_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.workspace_general_settings?.reimbursable_expenses_object, exportSettingValidatorRule.reimbursableExpense, this.exportSettingForm);
      }

      if (this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object) {
        this.qboExportSettingsService.setupDynamicValidators(this.exportSettingForm, employeeMappingControl, exportModuleRule[1], this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object, exportSettingValidatorRule.creditCardExpense, this.exportSettingForm);
      }

      this.isMultilineOption = brandingConfig.brandId !== 'co' ? true : false;

      this.setupExportTypeWatcher();
      this.setupCustomWatchers();
      this.setupCustomDateOptionWatchers();
      this.optionSearchWatcher();

      this.qboExportSettingsService.setExportTypeValidatorsAndWatchers(
        exportModuleRule, this.exportSettingForm, employeeMappingControl
      );

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.reimbursableExpenseGroupingDateOptions = this.qboExportSettingsService.getReimbursableExpenseGroupingDateOptions();
    this.creditCardExportTypes = this.qboExportSettingsService.getCreditCardExportTypes();
    this.cccExpenseStateOptions = this.qboExportSettingsService.getCCCExpenseStateOptions();
    this.expenseStateOptions = this.qboExportSettingsService.getReimbursableExpenseStateOptions();
    this.expenseGroupByOptions = this.qboExportSettingsService.getExpenseGroupByOptions();
    this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();
    this.nameInJournalOptions = this.qboExportSettingsService.getNameInJournalOptions();
    this.splitExpenseGroupingOptions = this.qboExportSettingsService.getSplitExpenseGroupingOptions();
    this.employeeMappingOptions = this.employeeSettingsService.getEmployeeFieldMappingOptions();
    this.autoMapEmployeeOptions = this.qboEmployeeSettingsService.getAutoMapEmployeeOptions();

    this.getSettingsAndSetupForm();
  }

}
