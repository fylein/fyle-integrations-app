import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, ConfigurationCta, EmployeeFieldMapping, ExpenseGroupingFieldOption, Page, ProgressPhase, QBDCorporateCreditCardExpensesObject, QbdDirectExpenseGroupBy, QbdDirectExportSettingDestinationAccountType, QbdDirectExportSettingDestinationOptionKey, QbdDirectOnboardingState, QbdDirectReimbursableExpensesObject, QbdDirectUpdateEvent, QBDExpenseGroupedBy, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { QbdDirectExportSettingGet, QbdDirectExportSettingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { catchError, debounceTime, filter, forkJoin, Observable, of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { EmployeeSettingModel } from 'src/app/core/models/common/employee-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExportSettingModel, ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { QbdDirectDestinationAttribute } from 'src/app/core/models/qbd-direct/db/qbd-direct-destination-attribuite.model';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { QbdDirectHelperService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-helper.service';

@Component({
  selector: 'app-qbd-direct-export-settings',
  templateUrl: './qbd-direct-export-settings.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  styleUrl: './qbd-direct-export-settings.component.scss'
})
export class QbdDirectExportSettingsComponent implements OnInit{

  isLoading: boolean;

  isOnboarding: any;

  exportSettings: QbdDirectExportSettingGet | null;

  exportSettingsForm: FormGroup;

  cccExpenseGroupingDateOptions: SelectFormOption[] = QbdDirectExportSettingModel.creditCardExpenseGroupingDateOptions();

  cccExpenseStateOptions: QBDExportSettingFormOption[];

  expenseStateOptions: QBDExportSettingFormOption[];

  reimbursableExpenseGroupingFieldOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.expenseGroupingFieldOptions();

  creditCardExpenseGroupingFieldOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.expenseGroupingFieldOptions();

  reimbursableExpenseGroupingDateOptions: SelectFormOption[] = QbdDirectExportSettingModel.reimbursableExpenseGroupingDateOptions();

  creditCardExportTypes: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.creditCardExportTypes();

  reimbursableExportTypes: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.reimbursableExportTypes();

  nameInJEOptions: QBDExportSettingFormOption[] = QbdDirectExportSettingModel.nameInJEOptions();

  employeeMappingOptions: SelectFormOption[] = EmployeeSettingModel.getEmployeeFieldMappingOptions();

  appName: AppName = AppName.QBD_DIRECT;

  redirectLink: string = brandingKbArticles.topLevelArticles.QBD_DIRECT;

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent.qbd_direct.configuration.exportSetting;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  QBDCorporateCreditCardExpensesObject = QBDCorporateCreditCardExpensesObject;

  isSaveInProgress: boolean;

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
    private workspaceService: WorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private qbdDirectHelperService: QbdDirectHelperService
  ) { }

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
    this.isSaveInProgress = true;
      const exportSettingPayload = QbdDirectExportSettingModel.constructPayload(this.exportSettingsForm);
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
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(QbdDirectOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/qbd_direct/onboarding/import_settings`]);
        }
      }, () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
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
        this.exportSettingsForm.controls.creditCardExportGroup.patchValue(QbdDirectExportSettingModel.expenseGroupingFieldOptions()[1].value);
        this.exportSettingsForm.controls.creditCardExportGroup.disable();
      }
    });
  }

  reimbursableExpenseGroupWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExportGroup.valueChanges.subscribe((reimbursableExportGroupValue) => {
      this.reimbursableExpenseGroupingDateOptions = ExportSettingModel.constructExportDateOptions(false, reimbursableExportGroupValue, this.exportSettingsForm.controls.reimbursableExportDate.value);
    });
  }

  cccExpenseGroupWatcher(): void {
    this.exportSettingsForm.controls.creditCardExportGroup.valueChanges.subscribe((creditCardExportGroupValue) => {
      if (this.exportSettingsForm.controls.creditCardExportType.value === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE) {
        this.cccExpenseGroupingDateOptions = ExportSettingModel.constructExportDateOptions(true, creditCardExportGroupValue, this.exportSettingsForm.controls.creditCardExportDate.value);
      } else {
        this.cccExpenseGroupingDateOptions = ExportSettingModel.constructExportDateOptions(false, creditCardExportGroupValue, this.exportSettingsForm.controls.creditCardExportDate.value);
      }
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
        this.exportSettingsForm.controls.creditCardExportGroup.patchValue(QbdDirectExportSettingModel.expenseGroupingFieldOptions()[1].value);
        this.exportSettingsForm.controls.creditCardExportGroup.disable();
      } else {
        this.exportSettingsForm.controls.creditCardExportGroup.enable();
      }
    });
  }

  reimburesmentExpenseGroupingWatcher() {
    this.exportSettingsForm.controls.defaultReimbursableAccountsPayableAccountName.valueChanges.subscribe((defaultReimbursableAccountsPayableAccountNameValue: QbdDirectDestinationAttribute) => {
      if (defaultReimbursableAccountsPayableAccountNameValue?.detail?.account_type === 'AccountsPayable') {
        this.exportSettingsForm.controls.reimbursableExportGroup.patchValue(QbdDirectExportSettingModel.expenseGroupingFieldOptions()[1].value);
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

    this.cccExpenseStateOptions = QbdDirectExportSettingModel.cccExpenseStateOptions();
    this.expenseStateOptions = QbdDirectExportSettingModel.expenseStateOptions();

    this.destinationAccounts = accounts as QbdDirectDestinationAttribute[];

    this.exportSettingsForm = QbdDirectExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, this.destinationAccounts);

    this.helperService.addExportSettingFormValidator(this.exportSettingsForm);

    const [exportSettingValidatorRule, exportModuleRule] = QbdDirectExportSettingModel.getValidators();

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
      ...groupedAttributes
    ]).subscribe(([exportSettingResponse, ...paginatedAccounts]) => {

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
