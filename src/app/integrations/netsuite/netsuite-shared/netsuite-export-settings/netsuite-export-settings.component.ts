import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, FyleField, IntacctReimbursableExpensesObject, NetSuiteCorporateCreditCardExpensesObject, NetsuiteOnboardingState, NetsuiteReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ExportSettingFormOption } from 'src/app/core/models/intacct/intacct-configuration/export-settings.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { NetSuiteExportSettingGet, NetSuiteExportSettingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-export-setting.model';
import { QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';

@Component({
  selector: 'app-netsuite-export-settings',
  templateUrl: './netsuite-export-settings.component.html',
  styleUrls: ['./netsuite-export-settings.component.scss']
})
export class NetsuiteExportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.QBO.EXPORT_SETTING;

  brandingConfig = brandingConfig;

  isOnboarding: boolean;

  windowReference: Window;

  exportSettings: NetSuiteExportSettingGet;

  employeeFieldMapping: EmployeeFieldMapping;

  bankAccounts: DefaultDestinationAttribute[];

  cccAccounts: DefaultDestinationAttribute[];

  accountsPayables: DefaultDestinationAttribute[];

  vendors: DefaultDestinationAttribute[];

  isImportItemsEnabled: boolean;

  reimbursableExportTypes: SelectFormOption[];
  
  employeeFieldOptions: ExportSettingFormOption[] = [
    {
      label: 'Employee',
      value: FyleField.EMPLOYEE
    },
    {
      label: 'Vendor',
      value: FyleField.VENDOR
    }
  ];

  creditCardExportTypes = NetSuiteExportSettingModel.getCreditCardExportTypes();

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

  NetSuiteCorporateCreditCardExpensesObject = NetSuiteCorporateCreditCardExpensesObject;

  NetSuiteReimbursableExpensesObject = NetsuiteReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  previewImagePaths =[
    {
      [NetsuiteReimbursableExpensesObject.EXPENSE_REPORT]: 'assets/pngs/preview-screens/qbo-reimburse-expense.png',
      [NetsuiteReimbursableExpensesObject.BILL]: 'assets/pngs/preview-screens/qbo-reimburse-bill.png',
      [NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY]: 'assets/pngs/preview-screens/qbo-reimburse-journal-entry.png',
    },
    {
      [NetSuiteCorporateCreditCardExpensesObject.BILL]: 'assets/pngs/preview-screens/qbo-ccc-bill.png',
      [NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE]: 'assets/pngs/preview-screens/qbo-ccc-expense.png',
      [NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: 'assets/pngs/preview-screens/qbo-ccc-journal-entry.png',
      [NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT]: 'assets/pngs/preview-screens/qbo-ccc-debit-card.png'
    }
  ];

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private exportSettingService: NetsuiteExportSettingsService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }
  
  getEmployeeFieldMapping(employeeFieldMapping: FyleField | null, reimbursableExportType: string): string {
    let employeeFieldMappingLabel = '';
    if (employeeFieldMapping) {
      employeeFieldMappingLabel = employeeFieldMapping;
    } else if (reimbursableExportType === IntacctReimbursableExpensesObject.JOURNAL_ENTRY) {
      employeeFieldMappingLabel = this.exportSettingForm.controls.employeeFieldMapping.value;
    } else {
      employeeFieldMappingLabel = reimbursableExportType === IntacctReimbursableExpensesObject.EXPENSE_REPORT ? FyleField.EMPLOYEE : FyleField.VENDOR;
    }

    return new TitleCasePipe().transform(employeeFieldMappingLabel);
  }

  constructPayloadAndSave(data: ConfigurationWarningOut): void {
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
        } else {
          this.router.navigate(['/integrations/netsuite/main/dashboard']);
        }
      }, () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
    }
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbo/onboarding/employee_settings`]);
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
    if ((updatedConfiguration === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY) && this.isImportItemsEnabled) {
      return `${content} <br><br>Also, Products/services previously imported as categories in ${brandingConfig.brandName} will be disabled.`;
    }
    // If any export-type is not journal entry or import_items is set to false, simply return the normal constructed content
    return content;
  }

  private constructWarningMessage(): string {
    let content: string = '';
    const existingReimbursableExportType = this.exportSettings.configurations?.reimbursable_expenses_object ? this.exportSettings.configurations.reimbursable_expenses_object : 'None';
    const existingCorporateCardExportType = this.exportSettings.configurations?.corporate_credit_card_expenses_object ? this.exportSettings.configurations.corporate_credit_card_expenses_object : 'None';
    const updatedReimbursableExportType = this.exportSettingForm.value.reimbursableExportType ? this.exportSettingForm.value.reimbursableExportType : 'None';
    const updatedCorporateCardExportType = this.exportSettingForm.value.creditCardExportType ? this.exportSettingForm.value.creditCardExportType : 'None';

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
    return this.exportSettings.configurations.reimbursable_expenses_object !== null || this.exportSettings.configurations.corporate_credit_card_expenses_object !== null;
  }

  private isSingleItemizedJournalEntryAffected(): boolean {
    return (this.exportSettings?.configurations?.reimbursable_expenses_object !== NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.value.reimbursableExportType === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY) || (this.exportSettings?.configurations?.corporate_credit_card_expenses_object !== NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.value.creditCardExportType === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
  }

  private isPaymentsSyncAffected(): boolean {
    return this.exportSettings?.configurations?.reimbursable_expenses_object !== NetsuiteReimbursableExpensesObject.BILL && this.exportSettingForm.value.reimbursableExportType  === NetsuiteReimbursableExpensesObject.BILL;
  }

  private isAdvancedSettingAffected(): boolean {
    if (this.isExportSettingsUpdated() && (this.isSingleItemizedJournalEntryAffected() || this.isPaymentsSyncAffected())) {
      return true;
    }

    return false;
  }

  private updateCCCExpenseGroupingDateOptions(selectedValue: NetSuiteCorporateCreditCardExpensesObject): void {
    if ([NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT, NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT].includes(selectedValue)) {
      this.cccExpenseGroupingDateOptions = NetSuiteExportSettingModel.getAdditionalCreditCardExpenseGroupingDateOptions();
      this.exportSettingForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
      this.exportSettingForm.controls.creditCardExportGroup.disable();
    } else {
      this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();
      this.helperService.clearValidatorAndResetValue(this.exportSettingForm, 'creditCardExportGroup');
      this.helperService.enableFormField(this.exportSettingForm, 'creditCardExportGroup');
    }
  }

  private setupCustomWatchers(): void {
    if (this.exportSettingForm.value.creditCardExportType && [NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT, NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT].includes(this.exportSettingForm.value.creditCardExportType)) {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.value.creditCardExportType);
    }

    this.exportSettingService.creditCardExportTypeChange.subscribe((selectedValue: NetSuiteCorporateCreditCardExpensesObject) => {
      this.showNameInJournalOption = selectedValue === NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT ? true : false;

      this.updateCCCExpenseGroupingDateOptions(selectedValue);
    });
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];

    forkJoin({
      exportSetting: this.exportSettingService.getExportSettings(),
      destinationAttributes: this.mappingService.getGroupedDestinationAttributes(destinationAttributes, 'v2', 'netsuite'),
      //workspaceGeneralSettings: this.workspaceService.getWorkspaceGeneralSettings()
    }).subscribe(({exportSetting, destinationAttributes}) => {
      this.exportSettings = exportSetting;
      //this.employeeFieldMapping = workspaceGeneralSettings.employee_field_mapping;

      this.bankAccounts = destinationAttributes.BANK_ACCOUNT.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.cccAccounts = destinationAttributes.CREDIT_CARD_ACCOUNT.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.accountsPayables = destinationAttributes.ACCOUNTS_PAYABLE.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.vendors = destinationAttributes.VENDOR.map((option: DestinationAttribute) => NetSuiteExportSettingModel.formatGeneralMappingPayload(option));

      this.reimbursableExportTypes = NetSuiteExportSettingModel.getReimbursableExportTypeOptions(this.EmployeeFieldMapping.EMPLOYEE);
      this.showNameInJournalOption = this.exportSettings.configurations?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.exportSettingForm = NetSuiteExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, this.employeeFieldMapping);

      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);

      const [exportSettingValidatorRule, exportModuleRule] = QBOExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      if (this.exportSettings.configurations?.reimbursable_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[0], this.exportSettings.configurations.reimbursable_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.configurations.reimbursable_expenses_object, exportSettingValidatorRule.reimbursableExpense, this.exportSettingForm);
      }

      if (this.exportSettings.configurations?.corporate_credit_card_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[1], this.exportSettings.configurations.corporate_credit_card_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.configurations.corporate_credit_card_expenses_object, exportSettingValidatorRule.creditCardExpense, this.exportSettingForm);
      }

      this.exportSettingService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

      this.setupCustomWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }
}
