import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime, filter, forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ExportSettingModel, ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { HelperUtility } from 'src/app/core/models/common/helper.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, FyleField, NameInJournalEntry, NetSuiteCorporateCreditCardExpensesObject, NetsuiteExportSettingDestinationOptionKey, NetsuiteOnboardingState, NetsuiteReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { NetSuiteExportSettingGet, NetSuiteExportSettingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';

@Component({
  selector: 'app-netsuite-export-settings',
  templateUrl: './netsuite-export-settings.component.html',
  styleUrls: ['./netsuite-export-settings.component.scss']
})
export class NetsuiteExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.NETSUITE.EXPORT_SETTING;

  brandingConfig = brandingConfig;

  isOnboarding: boolean;

  windowReference: Window;

  exportSettings: NetSuiteExportSettingGet;

  employeeFieldMapping: EmployeeFieldMapping;

  bankAccounts: DefaultDestinationAttribute[];

  cccAccounts: DefaultDestinationAttribute[];

  creditCardVendors: DefaultDestinationAttribute[];

  accountsPayables: DefaultDestinationAttribute[];

  reimbursableExportTypes: SelectFormOption[] =  NetSuiteExportSettingModel.getReimbursableExportTypeOptions();

  autoMapEmployeeOptions: SelectFormOption[] = NetSuiteExportSettingModel.getAutoMapEmplyeeOptions();

  employeeFieldOptions: SelectFormOption[] = NetSuiteExportSettingModel.getEmployeeFieldOptions();

  creditCardExportTypes = brandingConfig.brandId === 'co' ? NetSuiteExportSettingModel.getCoCreditCardExportTypes() : NetSuiteExportSettingModel.getCreditCardExportTypes();

  cccExpenseStateOptions = NetSuiteExportSettingModel.getCCCExpenseStateOptions();

  expenseStateOptions = NetSuiteExportSettingModel.getReimbursableExpenseStateOptions();

  expenseGroupByOptions = NetSuiteExportSettingModel.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions = NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();

  nameInJournalOptions = NetSuiteExportSettingModel.getNameInJournalOptions();

  showNameInJournalOption: boolean;

  exportSettingForm: FormGroup;

  isSaveInProgress: boolean;

  isConfirmationDialogVisible: boolean;

  warningDialogText: string;

  appName: AppName = AppName.NETSUITE;

  readonly brandingContent = brandingContent.netsuite.configuration.exportSetting;

  NetSuiteCorporateCreditCardExpensesObject = NetSuiteCorporateCreditCardExpensesObject;

  NetSuiteReimbursableExpensesObject = NetsuiteReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  previewImagePaths = [
    {
      [NetsuiteReimbursableExpensesObject.EXPENSE_REPORT]: 'assets/illustrations/netsuite/expences-report.png',
      [NetsuiteReimbursableExpensesObject.BILL]: 'assets/illustrations/netsuite/bill.png',
      [NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY]: 'assets/illustrations/netsuite/journal-entry.png'
    },
    {
      [NetSuiteCorporateCreditCardExpensesObject.BILL]: 'assets/illustrations/netsuite/bill.png',
      [NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE]: 'assets/illustrations/netsuite/ccc.png',
      [NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: 'assets/illustrations/netsuite/journal-entry.png',
      [NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT]: 'assets/illustrations/netsuite/expences-report.png'
    }
  ];

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  isOptionSearchInProgress: boolean;

  private optionSearchUpdate = new Subject<ExportSettingOptionSearch>();

  NetsuiteExportSettingDestinationOptionKey = NetsuiteExportSettingDestinationOptionKey;

  constructor(
    private exportSettingService: NetsuiteExportSettingsService,
    public helperService: HelperService,
    private netsuiteHelperServie: NetsuiteHelperService,
    private mappingService: MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }


  refreshDimensions() {
    this.netsuiteHelperServie.refreshNetsuiteDimensions().subscribe();
  }

  reimbursableExpenseGroupingDate(reimbursableExportGroup: ExpenseGroupingFieldOption, ExpenseGroupingDateOptions: SelectFormOption[]): SelectFormOption[] {
      return ExportSettingModel.constructGroupingDateOptions(reimbursableExportGroup, ExpenseGroupingDateOptions);
  }

  private reimbursableExportTypeWatcher(): void {
    this.exportSettingForm.controls.reimbursableExportType.valueChanges.subscribe((isreimbursableExportTypeSelected) => {
      if (isreimbursableExportTypeSelected === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY) {
        this.exportSettingForm.controls.employeeFieldMapping.enable();
      } else if (isreimbursableExportTypeSelected === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT) {
        this.exportSettingForm.controls.employeeFieldMapping.patchValue(FyleField.EMPLOYEE);
        this.exportSettingForm.controls.employeeFieldMapping.disable();
      } else if (isreimbursableExportTypeSelected === NetsuiteReimbursableExpensesObject.BILL) {
        this.exportSettingForm.controls.employeeFieldMapping.patchValue(FyleField.VENDOR);
        this.exportSettingForm.controls.employeeFieldMapping.disable();
      }
    });
    this.exportSettingForm.controls.employeeFieldMapping.valueChanges.subscribe((isemployeeFieldMappingSelected) => {
      const [exportSettingValidatorRule, exportModuleRule] = NetSuiteExportSettingModel.getValidators();
      this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[0], NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
    });
  }

  private cccExportTypeWatcher(): void {
    this.exportSettingForm.controls.creditCardExportType.valueChanges.subscribe((isCCCExportTypeSelected) => {
      if (isCCCExportTypeSelected === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && !this.exportSettings?.configuration?.reimbursable_expenses_object) {
        this.exportSettingForm.controls.employeeFieldMapping.enable();
        this.exportSettingForm.controls.nameInJournalEntry.patchValue(NameInJournalEntry.EMPLOYEE);
      }
    });
    this.exportSettingForm.controls.nameInJournalEntry.valueChanges.subscribe((isNameInJournalEntrySelected) => {
        if (isNameInJournalEntrySelected === NameInJournalEntry.MERCHANT ) {
          HelperUtility.markControllerAsRequired(this.exportSettingForm, 'defaultCreditCardVendor');
        }
    });
  }

  private exportFieldsWatcher(): void {
    if (this.exportSettings?.configuration?.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY || (this.exportSettings?.configuration?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && !this.exportSettings?.configuration?.reimbursable_expenses_object)) {
      this.exportSettingForm.get('employeeFieldMapping')?.enable();
    } else {
      this.exportSettingForm.get('employeeFieldMapping')?.disable();
    }

    if (this.exportSettings?.configuration?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE) {
      this.exportSettingForm.controls.creditCardExportGroup.setValue(this.expenseGroupByOptions[0].value);
      this.exportSettingForm.controls.creditCardExportGroup.disable();
    }
    this.reimbursableExportTypeWatcher();
    this.cccExportTypeWatcher();
  }

  getEmployeeFieldMapping(employeeFieldMapping: FyleField | null, reimbursableExportType: string): string {
    let employeeFieldMappingLabel = '';
    if (employeeFieldMapping) {
      employeeFieldMappingLabel = employeeFieldMapping;
    } else if (reimbursableExportType === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY) {
      employeeFieldMappingLabel = this.exportSettingForm.controls.employeeFieldMapping.value;
    } else {
      employeeFieldMappingLabel = reimbursableExportType === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT ? FyleField.EMPLOYEE : FyleField.VENDOR;
    }

    return new TitleCasePipe().transform(employeeFieldMappingLabel);
  }

  constructPayloadAndSave(data: ConfigurationWarningOut): void {
    this.isConfirmationDialogVisible = false;
    if (data.hasAccepted) {
      this.isSaveInProgress = true;
      const exportSettingPayload = NetSuiteExportSettingModel.constructPayload(this.exportSettingForm);
      this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: NetSuiteExportSettingGet) => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(NetsuiteOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/netsuite/onboarding/import_settings`]);
        } else if (this.isAdvancedSettingAffected()) {
          this.router.navigate(['/integrations/netsuite/main/configuration/advanced_settings']);
        }
      }, () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
    }
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/netsuite/onboarding/connector`]);
  }

  private isAdvancedSettingAffected(): boolean {
    return (this.exportSettings?.configuration?.reimbursable_expenses_object !== NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.value.reimbursableExportType === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY) || (this.exportSettings?.configuration?.corporate_credit_card_expenses_object !== NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.value.creditCardExportType === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
  }

  private replaceContentBasedOnConfiguration(updatedConfiguration: string, existingConfiguration: string | undefined | null, exportType: string): string {
    const configurationUpdate = `You have changed the export type of $exportType expense from <b>$existingExportType</b> to <b>$updatedExportType</b>,
    which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
    features that could help customize and automate your integration workflows.`;

    let content = '';
    // If both are not none and it is an update case else for the new addition case
    if (updatedConfiguration && existingConfiguration) {
      content = configurationUpdate.replace('$exportType', exportType).replace('$existingExportType', existingConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())).replace('$updatedExportType', updatedConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()));
    }

    return content;
  }

  private constructWarningMessage(): string {
    let content: string = '';
    const existingReimbursableExportType = this.exportSettings?.configuration?.reimbursable_expenses_object;
    const existingCorporateCardExportType = this.exportSettings?.configuration?.corporate_credit_card_expenses_object;

    const updatedReimbursableExportType = this.exportSettingForm.value.reimbursableExportType ? this.exportSettingForm.value.reimbursableExportType : null;
    const updatedCorporateCardExportType = this.exportSettingForm.value.creditCardExportType ? this.exportSettingForm.value.creditCardExportType : null;

    let updatedExportType;
    let existingExportType;
    let exportType;

    if (existingReimbursableExportType !== updatedReimbursableExportType) {
      updatedExportType = updatedReimbursableExportType;
      existingExportType = existingReimbursableExportType;
      exportType = 'reimbursable';
    } else if (existingCorporateCardExportType !== updatedCorporateCardExportType) {
      updatedExportType = updatedCorporateCardExportType;
      existingExportType = existingCorporateCardExportType;
      exportType = 'credit card';
    }

    if (this.isAdvancedSettingAffected() && exportType) {
      content = this.replaceContentBasedOnConfiguration(updatedExportType, existingExportType, exportType);
    }

    return content;
  }

  save(): void {
    if (this.isAdvancedSettingAffected()) {
      this.warningDialogText = this.constructWarningMessage();
      this.isConfirmationDialogVisible = true;
      return;
    }
    this.constructPayloadAndSave({hasAccepted: true, event: ConfigurationWarningEvent.NETSUITE_EXPORT_SETTINGS});
  }

  private updateCCCExpenseGroupingDateOptions(selectedValue: NetSuiteCorporateCreditCardExpensesObject): void {
    if (selectedValue === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE) {
      this.cccExpenseGroupingDateOptions = NetSuiteExportSettingModel.getAdditionalCreditCardExpenseGroupingDateOptions();
      this.exportSettingForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
      this.exportSettingForm.controls.creditCardExportGroup.disable();
    } else {
      this.cccExpenseGroupingDateOptions = ExportSettingModel.constructGroupingDateOptions(this.exportSettingForm.get('creditCardExportGroup')?.value, NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions());
    }
  }

  private setupCustomWatchers(): void {
    if (this.exportSettingForm.get('creditCardExportType')?.value && (this.exportSettingForm.get('creditCardExportType')?.value === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE)) {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.get('creditCardExportType')?.value);
    }

    this.exportSettingService.creditCardExportTypeChange.subscribe((selectedValue: NetSuiteCorporateCreditCardExpensesObject) => {
      this.showNameInJournalOption = selectedValue === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;
      this.updateCCCExpenseGroupingDateOptions(selectedValue);
    });
  }

  private setupCustomDateOptionWatchers(): void {
    if (brandingConfig.brandId === 'fyle') {
      this.reimbursableExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDate(this.exportSettingForm.controls.reimbursableExportGroup?.value, NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions());
      if (this.exportSettingForm.get('creditCardExportType')?.value && this.exportSettingForm.get('creditCardExportType')?.value !== NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE) {
        this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDate(this.exportSettingForm.controls.creditCardExportGroup?.value, NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions());
      }
    }

    this.exportSettingForm.controls.reimbursableExportGroup?.valueChanges.subscribe((reimbursableExportGroup) => {
      if (brandingConfig.brandId === 'fyle') {
        const reimbursableExpenseGroupingDateOptions = NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions();
        this.reimbursableExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDate(reimbursableExportGroup, reimbursableExpenseGroupingDateOptions);
      }
    });

    this.exportSettingForm.controls.creditCardExportType.valueChanges.subscribe(creditCardExportType => {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.get('creditCardExportType')?.value);
    });

    this.exportSettingForm.controls.creditCardExportGroup?.valueChanges.subscribe((creditCardExportGroup) => {
      if (brandingConfig.brandId==='fyle' && this.exportSettingForm.get('creditCardExportType')?.value && this.exportSettingForm.get('creditCardExportType')?.value !== NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE) {
        const cccExpenseGroupingDateOptions = NetSuiteExportSettingModel.getReimbursableExpenseGroupingDateOptions();
        this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDate(creditCardExportGroup, cccExpenseGroupingDateOptions);
      }
    });
  }


  private optionSearchWatcher(): void {
    this.optionSearchUpdate.pipe(
      debounceTime(1000)
    ).subscribe((event: ExportSettingOptionSearch) => {
      let existingOptions: DefaultDestinationAttribute[] = [];

      switch (event.destinationOptionKey) {
        case NetsuiteExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE:
          existingOptions = this.accountsPayables;
          break;
        case NetsuiteExportSettingDestinationOptionKey.BANK_ACCOUNT:
          existingOptions = this.bankAccounts;
          break;
        case NetsuiteExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT:
          existingOptions = this.cccAccounts;
          break;
        case NetsuiteExportSettingDestinationOptionKey.VENDOR:
          existingOptions = this.creditCardVendors;
          break;
      }

      let newOptions: DefaultDestinationAttribute[];

      this.mappingService.getPaginatedDestinationAttributes(event.destinationOptionKey, event.searchTerm).subscribe((response) => {

        // Convert DestinationAttributes to DefaultDestinationAttributes (name, id)
        newOptions = response.results.map(NetSuiteExportSettingModel.formatGeneralMappingPayload);

        // Insert new options to existing options
        newOptions.forEach((option) => {
          if (!existingOptions.find((existingOption) => existingOption.id === option.id)) {
            existingOptions.push(option);
          }
        });


        switch (event.destinationOptionKey) {
          case NetsuiteExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE:
            this.accountsPayables = existingOptions.concat();
            this.accountsPayables.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
          case NetsuiteExportSettingDestinationOptionKey.BANK_ACCOUNT:
            this.bankAccounts = existingOptions.concat();
            this.bankAccounts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
          case NetsuiteExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT:
            this.cccAccounts = existingOptions.concat();
            this.cccAccounts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
          case NetsuiteExportSettingDestinationOptionKey.VENDOR:
            this.creditCardVendors = existingOptions.concat();
            this.creditCardVendors.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        }

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

  addMissingOptions() {
    if (this.exportSettings.general_mappings) {
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.bankAccounts, newOption: this.exportSettings.general_mappings.reimbursable_account});
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.cccAccounts, newOption: this.exportSettings.general_mappings.default_ccc_account});
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.accountsPayables, newOption: this.exportSettings.general_mappings.accounts_payable});
      this.helperService.addDefaultDestinationAttributeIfNotExists({options: this.creditCardVendors, newOption: this.exportSettings.general_mappings.default_ccc_vendor});
    }
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    const destinationAttributes = ['VENDOR', 'ACCOUNTS_PAYABLE', 'BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT'];

    const groupedAttributes: Observable<PaginatedDestinationAttribute>[]= [];

    destinationAttributes.forEach((destinationAttribute) => {
      groupedAttributes.push(this.mappingService.getPaginatedDestinationAttributes(destinationAttribute).pipe(filter(response => !!response)));
    });

    forkJoin([
      this.exportSettingService.getExportSettings(),
      ...groupedAttributes
    ]).subscribe(([exportSetting, vendors, accountsPayables, bankAccounts, cccAccounts]) => {
      this.exportSettings = exportSetting;

      this.creditCardVendors =  vendors.results.map((option) => NetSuiteExportSettingModel.formatGeneralMappingPayload(option));
      this.accountsPayables = accountsPayables.results.map((option) => NetSuiteExportSettingModel.formatGeneralMappingPayload(option));
      this.bankAccounts =  bankAccounts.results.map((option) => NetSuiteExportSettingModel.formatGeneralMappingPayload(option));
      this.cccAccounts =  cccAccounts.results.map((option) => NetSuiteExportSettingModel.formatGeneralMappingPayload(option));

      this.reimbursableExportTypes = NetSuiteExportSettingModel.getReimbursableExportTypeOptions();
      this.showNameInJournalOption = this.exportSettings.configuration?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.addMissingOptions();
      this.exportSettingForm = NetSuiteExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);
      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);

      const [exportSettingValidatorRule, exportModuleRule] = NetSuiteExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      if (this.exportSettings.configuration && this.exportSettings.configuration.reimbursable_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[0], this.exportSettings.configuration.reimbursable_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.configuration.reimbursable_expenses_object, exportSettingValidatorRule.reimbursableExpense, this.exportSettingForm);
      }

      if (this.exportSettings.configuration && this.exportSettings.configuration.corporate_credit_card_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[1], this.exportSettings.configuration.corporate_credit_card_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.configuration.corporate_credit_card_expenses_object, exportSettingValidatorRule.creditCardExpense, this.exportSettingForm);
      }

      this.exportSettingService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

      this.exportFieldsWatcher();
      this.optionSearchWatcher();
      this.setupCustomWatchers();
      this.setupCustomDateOptionWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }
}
