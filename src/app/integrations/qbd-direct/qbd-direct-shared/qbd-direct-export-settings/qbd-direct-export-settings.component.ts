import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, ConfigurationCta, EmployeeFieldMapping, ExpenseGroupingFieldOption, Page, ProgressPhase, QBDCorporateCreditCardExpensesObject, QbdDirectCCCExportDateType, QbdDirectExpenseGroupBy, QbdDirectExportSettingDestinationAccountType, QbdDirectExportSettingDestinationOptionKey, QbdDirectOnboardingState, QbdDirectReimbursableExpensesObject, QbdDirectUpdateEvent, QBDExpenseGroupedBy, ToastSeverity, TrackingApp, QBDReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { QbdDirectExportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { QbdDirectImportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { QbdDirectImportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { catchError, debounceTime, filter, forkJoin, Observable, of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { QbdDirectDestinationAttribute } from 'src/app/core/models/qbd-direct/db/qbd-direct-destination-attribuite.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { QbdDirectHelperService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-helper.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { EmployeeSettingsService } from 'src/app/core/services/common/employee-settings.service';
import { ExportSettingsService } from 'src/app/core/services/common/export-settings.service';

@Component({
  selector: 'app-qbd-direct-export-settings',
  templateUrl: './qbd-direct-export-settings.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslocoModule],
  styleUrl: './qbd-direct-export-settings.component.scss'
})
export class QbdDirectExportSettingsComponent implements OnInit{

  isLoading: boolean;

  isOnboarding: any;

  exportSettings: QbdDirectExportSettingGet | null;

  isImportItemsEnabled: boolean;

  exportSettingsForm: FormGroup;

  cccExpenseGroupingDateOptions: SelectFormOption[] = [];

  cccExpenseStateOptions: QBDExportSettingFormOption[];

  expenseStateOptions: QBDExportSettingFormOption[];

  reimbursableExpenseGroupingFieldOptions: QBDExportSettingFormOption[] = this.qbdDirectExportSettingsService.expenseGroupingFieldOptions();

  creditCardExpenseGroupingFieldOptions: QBDExportSettingFormOption[] = this.qbdDirectExportSettingsService.expenseGroupingFieldOptions();

  reimbursableExpenseGroupingDateOptions: SelectFormOption[] = [];

  creditCardExportTypes: QBDExportSettingFormOption[] = this.qbdDirectExportSettingsService.creditCardExportTypes();

  reimbursableExportTypes: QBDExportSettingFormOption[] = this.qbdDirectExportSettingsService.reimbursableExportTypes();

  nameInJEOptions: QBDExportSettingFormOption[] = this.qbdDirectExportSettingsService.nameInJEOptions();

  employeeMappingOptions: SelectFormOption[] = this.employeeSettingsService.getEmployeeFieldMappingOptions();

  appName: AppName = AppName.QBD_DIRECT;

  redirectLink: string = brandingKbArticles.topLevelArticles.QBD_DIRECT;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  QBDCorporateCreditCardExpensesObject = QBDCorporateCreditCardExpensesObject;

  isSaveInProgress: boolean;

  isConfirmationDialogVisible: boolean;

  warningDialogText: string;

  ConfigurationCtaText = ConfigurationCta;

  destinationAccounts: QbdDirectDestinationAttribute[];

  QbdDirectExportSettingDestinationOptionKey = QbdDirectExportSettingDestinationOptionKey;

  QbdDirectExportSettingDestinationAccountType = QbdDirectExportSettingDestinationAccountType;

  isOptionSearchInProgress: boolean;

  private optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  sessionStartTime: Date = new Date();

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private exportSettingService: QbdDirectExportSettingsService,
    private importSettingService: QbdDirectImportSettingsService,
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private qbdDirectHelperService: QbdDirectHelperService,
    private translocoService: TranslocoService,
    private qbdDirectExportSettingsService: QbdDirectExportSettingsService,
    private employeeSettingsService: EmployeeSettingsService
  ) {
    this.cccExpenseGroupingDateOptions = this.qbdDirectExportSettingsService.creditCardExpenseGroupingDateOptions();
    this.reimbursableExpenseGroupingDateOptions = this.qbdDirectExportSettingsService.reimbursableExpenseGroupingDateOptions();
  }

  isEmployeeMappingDisabled(): boolean {
    if (this.exportSettingsForm.get('reimbursableExportType')?.value === QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY || (!this.exportSettingsForm.get('reimbursableExpense')?.value && this.exportSettingsForm.get('creditCardExportType')?.value === QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY)) {
      return false;
    }
    return true;
  }

  isCccExportGroupDisabled(): boolean {
    if (this.exportSettingsForm.get('creditCardExportType')?.value === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
      return true;
    }
      if (this.exportSettingsForm.controls.defaultCCCAccountsPayableAccountName.value?.detail.account_type === 'AccountsPayable') {
        return true;
      }
      return false;

  }

  isReimbursableExportGroupDisabled(): boolean {
    if (this.exportSettingsForm.controls.defaultReimbursableAccountsPayableAccountName.value?.detail.account_type === 'AccountsPayable' && this.exportSettingsForm.controls.reimbursableExportType.value === QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY) {
      return true;
    }
    return false;
  }

  getReimbursableAccountTypes(): QbdDirectExportSettingDestinationAccountType[] {
    if (this.exportSettingsForm.controls.employeeMapping.value === EmployeeFieldMapping.EMPLOYEE) {
      return [
        QbdDirectExportSettingDestinationAccountType.Bank,
        QbdDirectExportSettingDestinationAccountType.CreditCard,
        QbdDirectExportSettingDestinationAccountType.OtherCurrentLiability,
        QbdDirectExportSettingDestinationAccountType.LongTermLiability
      ];
    }
    return [
      QbdDirectExportSettingDestinationAccountType.Bank,
      QbdDirectExportSettingDestinationAccountType.AccountsPayable,
      QbdDirectExportSettingDestinationAccountType.CreditCard,
      QbdDirectExportSettingDestinationAccountType.OtherCurrentLiability,
      QbdDirectExportSettingDestinationAccountType.LongTermLiability
    ];
  }

  reimbursableAccountOptions(): DestinationAttribute[] {
    const accountTypes = this.getReimbursableAccountTypes();
    return this.destinationOptionsWatcher(accountTypes, this.destinationAccounts);
  }

  getCCCAccountTypes(cccExportType: string) {
    if (cccExportType === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
      return [QbdDirectExportSettingDestinationAccountType.CreditCard];
    } else if (cccExportType === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingsForm.controls.employeeMapping.value === EmployeeFieldMapping.EMPLOYEE && this.exportSettingsForm.controls.nameInJE.value === EmployeeFieldMapping.EMPLOYEE) {
      return [
        QbdDirectExportSettingDestinationAccountType.Bank,
        QbdDirectExportSettingDestinationAccountType.CreditCard,
        QbdDirectExportSettingDestinationAccountType.OtherCurrentLiability,
        QbdDirectExportSettingDestinationAccountType.LongTermLiability
      ];
    }
    return [
      QbdDirectExportSettingDestinationAccountType.Bank,
      QbdDirectExportSettingDestinationAccountType.AccountsPayable,
      QbdDirectExportSettingDestinationAccountType.CreditCard,
      QbdDirectExportSettingDestinationAccountType.OtherCurrentLiability,
      QbdDirectExportSettingDestinationAccountType.LongTermLiability
    ];
  }

  cccAccountOptions(cccExportType: string): DestinationAttribute[] {
    const accountTypes = this.getCCCAccountTypes(cccExportType);
    return this.destinationOptionsWatcher(accountTypes, this.destinationAccounts);
  }

  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event: ExportSettingOptionSearch) => {
      let existingOptions: QbdDirectDestinationAttribute[] = [];

      existingOptions = this.destinationAccounts;

      let newOptions: QbdDirectDestinationAttribute[];

      let accountTypes: QbdDirectExportSettingDestinationAccountType[] | undefined;
      if (event.formControllerName === 'defaultReimbursableAccountsPayableAccountName') {
        accountTypes = this.getReimbursableAccountTypes();
      } else if (['defaultCreditCardAccountName', 'defaultCCCAccountsPayableAccountName'].includes(event.formControllerName)){
        accountTypes = this.getCCCAccountTypes(this.exportSettingsForm.get('creditCardExportType')?.value);
      }

      this.mappingService.getPaginatedDestinationAttributes(event.destinationOptionKey, event.searchTerm, undefined, undefined, accountTypes).subscribe((response) => {

        // Convert DestinationAttributes to DefaultDestinationAttributes (name, id)
        newOptions = response.results as QbdDirectDestinationAttribute[];

        // Insert new options to existing options
        newOptions.forEach((option) => {
          if (!existingOptions.find((existingOption) => existingOption.id === option.id)) {
            existingOptions.push(option);
          }
        });

        this.destinationAccounts = existingOptions.concat();
        this.destinationAccounts.sort((a, b) => (a.value || '').localeCompare(b.value || ''));

        this.isOptionSearchInProgress = false;
      });
    });
  }


  searchOptionsDropdown(event: ExportSettingOptionSearch): void {
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchUpdate.next(event);
    }
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  save() {
    if (this.isAdvancedSettingAffected()) {
      this.warningDialogText = this.constructWarningMessage();
      this.isConfirmationDialogVisible = true;
      return;
    }

    this.constructPayloadAndSave();
  }

  constructPayloadAndSave(data?: ConfigurationWarningOut): void {
    this.isConfirmationDialogVisible = false;

    // If data is provided (from warning dialog), check if user accepted
    if (data && !data.hasAccepted) {
      return; // Don't proceed if user clicked X or Cancel
    }

    this.isSaveInProgress = true;
      const exportSettingPayload = QbdDirectExportSettingsService.constructPayload(this.exportSettingsForm);
      this.exportSettingService.postQbdExportSettings(exportSettingPayload).subscribe((response: QbdDirectExportSettingGet) => {
        this.trackingService.trackTimeSpent(TrackingApp.QBD_DIRECT, Page.EXPORT_SETTING_QBD_DIRECT, this.sessionStartTime);
        if (this.workspaceService.getOnboardingState() === QbdDirectOnboardingState.EXPORT_SETTINGS) {
          this.trackingService.integrationsOnboardingCompletion(TrackingApp.QBD_DIRECT, QbdDirectOnboardingState.EXPORT_SETTINGS, 3, exportSettingPayload);
        } else {
          this.trackingService.onUpdateEvent(
            TrackingApp.QBD_DIRECT,
            QbdDirectUpdateEvent.EXPORT_SETTING_QBD_DIRECT,
            {
              phase: this.getPhase(),
              oldState: this.exportSettings,
              newState: response
            }
          );
        }

        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qbdDirectExportSettings.exportSettingsSavedSuccess'));

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(QbdDirectOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/qbd_direct/onboarding/import_settings`]);
        }
      }, () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectExportSettings.exportSettingsSaveError'));
      });
  }

  navigateToPreviousStep() {
    this.router.navigate([`/integrations/qbd_direct/onboarding/connector`]);
  }

  refreshDimensions() {
    this.qbdDirectHelperService.importAttributes(true);
  }

  cccExportTypeWatcher(): void {
    this.exportSettingsForm.controls.creditCardExportType.valueChanges.subscribe((creditCardExportTypeValue) => {
      if (creditCardExportTypeValue === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
        this.exportSettingsForm.controls.creditCardExportGroup.patchValue(this.qbdDirectExportSettingsService.expenseGroupingFieldOptions()[1].value);
        this.exportSettingsForm.controls.creditCardExportGroup.disable();
      }
    });
  }

  reimbursableExpenseGroupWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExportGroup.valueChanges.subscribe((reimbursableExportGroupValue) => {
      this.reimbursableExpenseGroupingDateOptions = this.qbdDirectExportSettingsService.constructExportDateOptions(false, reimbursableExportGroupValue, this.exportSettingsForm.controls.reimbursableExportDate.value);

      this.qbdDirectExportSettingsService.clearInvalidDateOption(
        this.exportSettingsForm.get('reimbursableExportDate'),
        this.reimbursableExpenseGroupingDateOptions
      );
    });
  }

  cccExpenseGroupWatcher(): void {
    this.exportSettingsForm.controls.creditCardExportGroup.valueChanges.subscribe((creditCardExportGroupValue) => {
      const isCoreCCCModule = this.exportSettingsForm.controls.creditCardExportType.value === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE;

      // As an exception, show posted_at to orgs that have already selected it outside the core CCC module
      let cccModuleWithPostedAtDateSelected;
      if (this.exportSettings?.credit_card_expense_date === QbdDirectCCCExportDateType.POSTED_AT) {
        cccModuleWithPostedAtDateSelected = this.exportSettings?.credit_card_expense_export_type;
      }

      const currentCCCModule = this.exportSettingsForm.get('creditCardExportType')?.value;

      const allowPostedAt = cccModuleWithPostedAtDateSelected === currentCCCModule;

      this.cccExpenseGroupingDateOptions = this.qbdDirectExportSettingsService.constructExportDateOptions(
        isCoreCCCModule,
        creditCardExportGroupValue,
        this.exportSettingsForm.controls.creditCardExportDate.value,
        { allowPostedAt }
      );

      this.qbdDirectExportSettingsService.clearInvalidDateOption(
        this.exportSettingsForm.get('creditCardExportDate'),
        this.cccExpenseGroupingDateOptions
      );
    });
  }

  employeeMappingWatcher() {
    this.exportSettingsForm.controls.reimbursableExportType.valueChanges.subscribe((reimbursableExportTypeValue) => {
      if (reimbursableExportTypeValue === QbdDirectReimbursableExpensesObject.BILL) {
        this.exportSettingsForm.controls.employeeMapping.patchValue(EmployeeFieldMapping.VENDOR);
      }
      // Else if (reimbursableExportTypeValue === QbdDirectReimbursableExpensesObject.CHECK) {
      //   This.exportSettingsForm.controls.employeeMapping.patchValue(EmployeeFieldMapping.EMPLOYEE);
      // }
    });
  }

  defaultAccountsPayableAccountWatcher() {
    this.exportSettingsForm.controls.employeeMapping.valueChanges.subscribe((employeeMapping) => {
      if (employeeMapping === EmployeeFieldMapping.EMPLOYEE) {
        if (this.exportSettingsForm.controls.defaultReimbursableAccountsPayableAccountName.value.detail.account_type === 'AccountsPayable') {
          this.exportSettingsForm.controls.defaultReimbursableAccountsPayableAccountName.patchValue(null);
          if (this.exportSettingsForm.controls.nameInJE.value === EmployeeFieldMapping.EMPLOYEE && this.exportSettingsForm.controls.defaultCCCAccountsPayableAccountName.value.detail.account_type === 'AccountsPayable') {
            this.exportSettingsForm.controls.defaultCCCAccountsPayableAccountName.patchValue(null);
          }
        }
      }
    });
  }

  defaultCCCAccountsPayableAccountWatcher() {
    this.exportSettingsForm.controls.nameInJE.valueChanges.subscribe((nameInJE) => {
      if (nameInJE === EmployeeFieldMapping.EMPLOYEE && this.exportSettingsForm.controls.employeeMapping.value === EmployeeFieldMapping.EMPLOYEE && this.exportSettingsForm.controls.defaultCCCAccountsPayableAccountName.value.detail.account_type === 'AccountsPayable') {
        this.exportSettingsForm.controls.defaultCCCAccountsPayableAccountName.patchValue(null);
      }
    });
  }

  cccExportGroupingWatcher() {
    this.exportSettingsForm.controls.defaultCCCAccountsPayableAccountName.valueChanges.subscribe((defaultCCCAccountsPayableAccountNameValue: QbdDirectDestinationAttribute) => {
      if (defaultCCCAccountsPayableAccountNameValue?.detail?.account_type === 'AccountsPayable') {
        this.exportSettingsForm.controls.creditCardExportGroup.patchValue(this.qbdDirectExportSettingsService.expenseGroupingFieldOptions()[1].value);
        this.exportSettingsForm.controls.creditCardExportGroup.disable();
      } else {
        this.exportSettingsForm.controls.creditCardExportGroup.enable();
      }
    });
  }

  reimburesmentExpenseGroupingWatcher() {
    this.exportSettingsForm.controls.defaultReimbursableAccountsPayableAccountName.valueChanges.subscribe((defaultReimbursableAccountsPayableAccountNameValue: QbdDirectDestinationAttribute) => {
      if (defaultReimbursableAccountsPayableAccountNameValue?.detail?.account_type === 'AccountsPayable') {
        this.exportSettingsForm.controls.reimbursableExportGroup.patchValue(this.qbdDirectExportSettingsService.expenseGroupingFieldOptions()[1].value);
        this.exportSettingsForm.controls.reimbursableExportGroup.disable();
      } else {
        this.exportSettingsForm.controls.reimbursableExportGroup.enable();
      }
    });
  }

  destinationOptionsWatcher(detailAccountType: string[], destinationOptions: QbdDirectDestinationAttribute[]): DestinationAttribute[] {
    return destinationOptions.filter((account: QbdDirectDestinationAttribute) =>  detailAccountType.includes(account.detail.account_type));
  }

  private exportsettingsWatcher(): void {

    this.cccExportTypeWatcher();

    this.employeeMappingWatcher();

    this.reimbursableExpenseGroupWatcher();

    this.cccExpenseGroupWatcher();

    this.defaultAccountsPayableAccountWatcher();

    this.defaultCCCAccountsPayableAccountWatcher();

    this.cccExportGroupingWatcher();

    this.reimburesmentExpenseGroupingWatcher();
  }

  private setupForm(exportSettingResponse: QbdDirectExportSettingGet | null, accounts: DestinationAttribute[]): void {
    this.exportSettings = exportSettingResponse;

    this.cccExpenseStateOptions = this.qbdDirectExportSettingsService.cccExpenseStateOptions();
    this.expenseStateOptions = this.qbdDirectExportSettingsService.expenseStateOptions();

    this.destinationAccounts = accounts as QbdDirectDestinationAttribute[];

    this.exportSettingsForm = this.qbdDirectExportSettingsService.mapAPIResponseToFormGroup(this.exportSettings, this.destinationAccounts);

    this.helperService.addExportSettingFormValidator(this.exportSettingsForm);

    const [exportSettingValidatorRule, exportModuleRule] = QbdDirectExportSettingsService.getValidators();

    this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingsForm);

    this.exportSettingService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingsForm);

    this.exportsettingsWatcher();

    this.optionSearchWatcher();

    this.isLoading = false;
  }

  /**
   * Get an observable to fetch default accounts if they are not already fetched by getPaginatedDestinationAttributes
   * @param exportSettingResponse The response from the export settings API (containing default account ids)
   * @param accounts The destination accounts fetched by getPaginatedDestinationAttributes
   * @returns If the default accounts are not already fetched, return an observable to fetch them. Otherwise, return null.
   */
  private getDefaultAccounts(exportSettingResponse: QbdDirectExportSettingGet | null, accounts: DestinationAttribute[]): Observable<PaginatedDestinationAttribute> | null {
    const defaultDestinationIds = [
      exportSettingResponse?.default_credit_card_account_id,
      exportSettingResponse?.default_reimbursable_accounts_payable_account_id,
      exportSettingResponse?.default_ccc_accounts_payable_account_id
    ];

    const existingDestinationIds = accounts.map((account) => account.destination_id);
    const destinationIdsToFetch = [];

    for (const defaultDestinationId of defaultDestinationIds) {
      if (defaultDestinationId && !existingDestinationIds.includes(defaultDestinationId)) {
        destinationIdsToFetch.push(defaultDestinationId);
      }
    }

    if (destinationIdsToFetch.length > 0) {
      return this.mappingService.getPaginatedDestinationAttributes('ACCOUNT', undefined, undefined, undefined, undefined, undefined, destinationIdsToFetch);
    }
    return null;
  }

  private convertEnumToHumanReadable(enumValue: string): string {
    if (!enumValue) {
      return enumValue;
    }

    // Convert snake_case/UPPER_CASE to human readable tex
    return enumValue
      .replace(/_/g, ' ')  // Replace underscores with spaces
      .toLowerCase()       // Convert to lowercase
      .replace(/^\w/, (c: string) => c.toUpperCase()); // Capitalize first letter
  }

  private replaceContentBasedOnConfiguration(updatedConfiguration: string, existingConfiguration: string, exportType: string): string {
    const updatedConfigHumanReadable = this.convertEnumToHumanReadable(updatedConfiguration);
    const existingConfigHumanReadable = this.convertEnumToHumanReadable(existingConfiguration);

    const newConfiguration = this.translocoService.translate('qbdDirectExportSettings.newExportTypeSelected', { exportType: exportType });
    const configurationUpdate = this.translocoService.translate('qbdDirectExportSettings.exportTypeChanged', { exportType: exportType, existingConfig: existingConfigHumanReadable, updatedConfig: updatedConfigHumanReadable });
    let content: string = '';

    if (existingConfiguration && existingConfiguration !== 'None') {
      content = configurationUpdate;
    } else {
      content = newConfiguration;
    }

    // Add Journal Entry warning for items
    if ((updatedConfiguration === QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY || updatedConfiguration === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY) && this.isImportItemsEnabled) {
      return this.translocoService.translate('qbdDirectExportSettings.itemsDisabledWarning', { content: content, brandName: brandingConfig.brandName });
    }

    return content;
  }

  private constructWarningMessage(): string {
    let content: string = '';
    const existingReimbursableExportType = this.exportSettings?.reimbursable_expense_export_type || 'None';
    const existingCorporateCardExportType = this.exportSettings?.credit_card_expense_export_type || 'None';
    const updatedReimbursableExportType = this.exportSettingsForm.get('reimbursableExportType')?.value || 'None';
    const updatedCorporateCardExportType = this.exportSettingsForm.get('creditCardExportType')?.value || 'None';

    if (this.isJournalEntryAffected()) {
      if (updatedReimbursableExportType !== existingReimbursableExportType) {
        content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, this.translocoService.translate('qbdDirectExportSettings.reimbursable'));
      } else if (existingCorporateCardExportType !== updatedCorporateCardExportType) {
        content = this.replaceContentBasedOnConfiguration(updatedCorporateCardExportType, existingCorporateCardExportType, this.translocoService.translate('qbdDirectExportSettings.creditCard'));
      }
    }

    return content;
  }

  private isExportSettingsUpdated(): boolean {
    return this.exportSettings?.reimbursable_expense_export_type !== null || this.exportSettings?.credit_card_expense_export_type !== null;
  }

  private isJournalEntryAffected(): boolean {
    return (this.exportSettings?.reimbursable_expense_export_type !== QBDReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettingsForm.get('reimbursableExportType')?.value === QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY) ||
           (this.exportSettings?.credit_card_expense_export_type !== QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingsForm.get('creditCardExportType')?.value === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
  }

  private isAdvancedSettingAffected(): boolean {
    if (this.isExportSettingsUpdated() && this.isJournalEntryAffected() && this.isImportItemsEnabled) {
      return true;
    }

    return false;
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');

    const accountTypes = [
      QbdDirectExportSettingDestinationAccountType.Bank,
      QbdDirectExportSettingDestinationAccountType.AccountsPayable,
      QbdDirectExportSettingDestinationAccountType.CreditCard,
      QbdDirectExportSettingDestinationAccountType.OtherCurrentLiability,
      QbdDirectExportSettingDestinationAccountType.LongTermLiability
    ];

    const groupedAttributes: Observable<PaginatedDestinationAttribute>[]= [];

    accountTypes.forEach((accountType) => {
      groupedAttributes.push(this.mappingService.getPaginatedDestinationAttributes('ACCOUNT', undefined, undefined, undefined, [accountType]).pipe(filter(response => !!response)));
    });

    forkJoin([
      this.exportSettingService.getQbdExportSettings().pipe(catchError(() => of(null))),
      this.importSettingService.getImportSettings().pipe(catchError(() => of(null))),
      ...groupedAttributes
    ]).subscribe(([exportSettingResponse, importSettingsResponse, ...paginatedAccounts]) => {

      // Extract items status
      this.isImportItemsEnabled = importSettingsResponse?.import_settings?.import_item_as_category || false;

      let accounts: DestinationAttribute[] = [];
      for (const response of paginatedAccounts) {
        accounts.push(...response.results);
      }

      const defaultAccountsObservable = this.getDefaultAccounts(exportSettingResponse, accounts);

      // If default accounts are not already fetched, make an additional GET call
      // To fetch the missing destination attributes, and then set up the form
      if (defaultAccountsObservable) {
        defaultAccountsObservable.subscribe((response) => {
          accounts = accounts.concat(response.results);
          this.setupForm(exportSettingResponse, accounts);
        });
      } else {
        this.setupForm(exportSettingResponse, accounts);
      }
    });
  }

  ngOnInit() {
    this.getSettingsAndSetupForm();
  }

}
