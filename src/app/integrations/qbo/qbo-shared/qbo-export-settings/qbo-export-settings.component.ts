import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, concat, debounceTime, filter, forkJoin, of } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ExportSettingModel, ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExportDateType, FyleField, QBOCorporateCreditCardExpensesObject, QBOOnboardingState, QBOReimbursableExpensesObject, QboExportSettingDestinationOptionKey, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { QBOExportSettingGet, QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
// Add to existing imports
import { EmployeeSettingModel } from 'src/app/core/models/common/employee-settings.model';
import { QBOEmployeeSettingGet, QBOEmployeeSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { QboEmployeeSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-employee-settings.service';

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

  cccAccounts: DefaultDestinationAttribute[];

  accountsPayables: DefaultDestinationAttribute[];

  vendors: DefaultDestinationAttribute[];

  expenseAccounts: DefaultDestinationAttribute[];

  isImportItemsEnabled: boolean;

  creditCardExportTypes = QBOExportSettingModel.getCreditCardExportTypes();

  cccExpenseStateOptions = QBOExportSettingModel.getCCCExpenseStateOptions();

  expenseStateOptions = QBOExportSettingModel.getReimbursableExpenseStateOptions();

  expenseGroupByOptions = QBOExportSettingModel.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions = QBOExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();

  nameInJournalOptions = QBOExportSettingModel.getNameInJournalOptions();

  showNameInJournalOption: boolean;

  exportSettingForm: FormGroup;

  isSaveInProgress: boolean;

  isConfirmationDialogVisible: boolean;

  warningDialogText: string;

  appName: AppName = AppName.QBO;

  QBOCorporateCreditCardExpensesObject = QBOCorporateCreditCardExpensesObject;

  QBOReimbursableExpensesObject = QBOReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  splitExpenseGroupingOptions = ExportSettingModel.getSplitExpenseGroupingOptions();

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

  readonly brandingContent = brandingContent.configuration.exportSetting;

  isMultilineOption: boolean;

  // Employee settings
  employeeSettingForm: FormGroup;

  employeeMappingOptions: SelectFormOption[] = EmployeeSettingModel.getEmployeeFieldMappingOptions();

  autoMapEmployeeOptions: SelectFormOption[] = QBOEmployeeSettingModel.getAutoMapEmployeeOptions();

  employeeSetting: QBOEmployeeSettingGet;

  existingEmployeeFieldMapping: EmployeeFieldMapping;

  liveEntityExample: {[FyleField.EMPLOYEE]: string | undefined, [FyleField.VENDOR]: string | undefined};

  constructor(
    private exportSettingService: QboExportSettingsService,
    public helperService: HelperService,
    private qboHelperService: QboHelperService,
    private mappingService: MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService,
    private employeeSettingService: QboEmployeeSettingsService
  ) {
    this.windowReference = this.windowService.nativeWindow;
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
        label: 'Check',
        value: QBOReimbursableExpensesObject.CHECK
      },
      {
        label: 'Bill',
        value: QBOReimbursableExpensesObject.BILL
      },
      {
        label: 'Expense',
        value: QBOReimbursableExpensesObject.EXPENSE
      },
      {
        label: 'Journal Entry',
        value: QBOReimbursableExpensesObject.JOURNAL_ENTRY
      }
    ];
  }

  constructPayloadAndSave(data: ConfigurationWarningOut): void {
    this.isConfirmationDialogVisible = false;
    if (data.hasAccepted) {
      this.isSaveInProgress = true;
      const exportSettingPayload = QBOExportSettingModel.constructPayload(this.exportSettingForm);
      const employeeSettingPayload = QBOEmployeeSettingModel.constructPayload(this.employeeSettingForm);

      concat(
        this.employeeSettingService.postEmployeeSettings(employeeSettingPayload),
        this.exportSettingService.postExportSettings(exportSettingPayload)
      ).subscribe({
        complete: () => {
          this.isSaveInProgress = false;
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export Settings saved successfully');
          if (this.isOnboarding) {
            this.workspaceService.setOnboardingState(QBOOnboardingState.IMPORT_SETTINGS);
            this.router.navigate([`/integrations/qbo/onboarding/import_settings`]);
        } else if (this.isAdvancedSettingAffected()) {
          this.router.navigate(['/integrations/qbo/main/configuration/advanced_settings']);
          }
        },
        error: () => {
          this.isSaveInProgress = false;
          this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
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
    const configurationUpdate = `You have changed the export type of $exportType expense from <b>$existingExportType</b> to <b>$updatedExportType</b>,
    which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
    features that could help customize and automate your integration workflows.`;

    const newConfiguration = `You have <b>selected a new export type</b> for the $exportType expense, which would impact a few configurations
      in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the features that could help customize and
      automate your integration workflows.`;

    let content = '';
    // If both are not none and it is an update case else for the new addition case
    if (updatedConfiguration !== 'None' && existingConfiguration !== 'None') {
      content = configurationUpdate.replace('$exportType', exportType).replace('$existingExportType', existingConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())).replace('$updatedExportType', updatedConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()));
    } else {
      content = newConfiguration.replace('$exportType', exportType);
    }

    // If any export-type has been changed to journal entry and has import_items set to true, then add the below content and return
    if ((updatedConfiguration === QBOReimbursableExpensesObject.JOURNAL_ENTRY) && this.isImportItemsEnabled) {
      return `${content} <br><br>Also, Products/services previously imported as categories in ${brandingConfig.brandName} will be disabled.`;
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
        content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, 'reimbursable');
      } else if (existingCorporateCardExportType !== updatedCorporateCardExportType) {
        content = this.replaceContentBasedOnConfiguration(updatedCorporateCardExportType, existingCorporateCardExportType, 'credit card');
      }
    }

    if (!this.isSingleItemizedJournalEntryAffected() && this.isPaymentsSyncAffected()) {
      content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, 'reimbursable');
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
      this.cccExpenseGroupingDateOptions = QBOExportSettingModel.getAdditionalCreditCardExpenseGroupingDateOptions();
      if (selectedValue === QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
        this.cccExpenseGroupingDateOptions.push({
          label: brandingContent.common.currentDate,
          value: ExportDateType.CURRENT_DATE
        });
      }
      this.exportSettingForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
      this.exportSettingForm.controls.creditCardExportGroup.disable();
    } else {
      this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();
      this.helperService.enableFormField(this.exportSettingForm, 'creditCardExportGroup');
    }
    const allowedValues = this.cccExpenseGroupingDateOptions.map(option => option.value);
    if (!allowedValues.includes(this.exportSettingForm.get('creditCardExportDate')?.value)) {
      this.exportSettingForm.get('creditCardExportDate')?.setValue(null);
    }
  }

  private setupCustomWatchers(): void {
    if (this.exportSettingForm.get('creditCardExportType')?.value && [QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE, QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE].includes(this.exportSettingForm.get('creditCardExportType')?.value)) {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.get('creditCardExportType')?.value);
    }

    this.exportSettingService.creditCardExportTypeChange.subscribe((selectedValue: QBOCorporateCreditCardExpensesObject) => {
      this.showNameInJournalOption = selectedValue === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.updateCCCExpenseGroupingDateOptions(selectedValue);
    });
  }

  private setupCustomDateOptionWatchers(): void {

    this.exportSettingForm.controls.reimbursableExportGroup?.valueChanges.subscribe((reimbursableExportGroup) => {
      this.reimbursableExpenseGroupingDateOptions = QBOExportSettingModel.getReimbursableExpenseGroupingDateOptions();
      this.reimbursableExpenseGroupingDateOptions = ExportSettingModel.constructGroupingDateOptions(reimbursableExportGroup, this.reimbursableExpenseGroupingDateOptions);
    });

    this.exportSettingForm.controls.creditCardExportType?.valueChanges.subscribe(creditCardExportType => {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.get('creditCardExportType')?.value);
    });


    this.exportSettingForm.controls.creditCardExportGroup?.valueChanges.subscribe((creditCardExportGroup) => {
      if (brandingConfig.brandId==='fyle' && this.exportSettingForm.get('creditCardExportType')?.value && this.exportSettingForm.get('creditCardExportType')?.value !== QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE && this.exportSettingForm.get('creditCardExportType')?.value !== QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE) {
        this.cccExpenseGroupingDateOptions = QBOExportSettingModel.getReimbursableExpenseGroupingDateOptions();
        this.cccExpenseGroupingDateOptions = ExportSettingModel.constructGroupingDateOptions(creditCardExportGroup, this.cccExpenseGroupingDateOptions);
      }
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

    if (event.destinationOptionKey === QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT) {
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
      case QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT:
        return this.cccAccounts;
      case QboExportSettingDestinationOptionKey.VENDOR:
        return this.vendors;
      case QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT:
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
      this.updateOptions(QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT, expenseAccounts, existingOptions);
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
    const newOptions = newResults.map(QBOExportSettingModel.formatGeneralMappingPayload);
    const updatedOptions = this.mergeOptions(existingOptions, newOptions);
    this.setUpdatedOptions(destinationOptionKey, updatedOptions);
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
      case QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT:
        this.cccAccounts = updatedOptions;
        break;
      case QboExportSettingDestinationOptionKey.VENDOR:
        this.vendors = updatedOptions;
        break;
      case QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT:
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
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.bankAccounts, newOption: this.exportSettings.general_mappings.default_debit_card_account});
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
      this.exportSettingService.getExportSettings(),
      this.workspaceService.getWorkspaceGeneralSettings().pipe(catchError(error => {
return of(null);
})),
      this.employeeSettingService.getDistinctQBODestinationAttributes([FyleField.EMPLOYEE, FyleField.VENDOR]),
      ...groupedAttributes
    ]).subscribe(([exportSetting, workspaceGeneralSettings, destinationAttributes, bankAccounts, cccAccounts, accountsPayables, vendors]) => {

      this.exportSettings = exportSetting;
      this.employeeFieldMapping = workspaceGeneralSettings?.employee_field_mapping;
      this.setLiveEntityExample(destinationAttributes);
      this.bankAccounts = bankAccounts.results.map((option) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.cccAccounts = cccAccounts.results.map((option) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.accountsPayables = accountsPayables.results.map((option) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.vendors = vendors.results.map((option) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);

      this.isImportItemsEnabled = workspaceGeneralSettings?.import_items || false;

      this.showNameInJournalOption = this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.addMissingOptions();
      this.exportSettingForm = QBOExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, this.employeeFieldMapping);
      this.employeeSettingForm = QBOExportSettingModel.createEmployeeSettingsForm(
        this.employeeFieldMapping,
        workspaceGeneralSettings?.auto_map_employees || false
      );
      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);

      const [exportSettingValidatorRule, exportModuleRule] = QBOExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      if (this.exportSettings.workspace_general_settings?.reimbursable_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[0], this.exportSettings.workspace_general_settings?.reimbursable_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.workspace_general_settings?.reimbursable_expenses_object, exportSettingValidatorRule.reimbursableExpense, this.exportSettingForm);
      }

      if (this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[1], this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object, exportSettingValidatorRule.creditCardExpense, this.exportSettingForm);
      }

      this.isMultilineOption = brandingConfig.brandId !== 'co' ? true : false;

      this.setupExportTypeWatcher();
      this.setupCustomWatchers();
      this.setupCustomDateOptionWatchers();
      this.optionSearchWatcher();

      this.exportSettingService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
