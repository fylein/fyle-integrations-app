import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, AutoMapEmployeeOptions, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, QBOCorporateCreditCardExpensesObject, QBOOnboardingState, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { QBOExportSettingGet, QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';

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

  reimbursableExportTypes: SelectFormOption[];

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

  constructor(
    private exportSettingService: QboExportSettingsService,
    public helperService: HelperService,
    private qboHelperService: QboHelperService,
    private mappingService: MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  constructPayloadAndSave(data: ConfigurationWarningOut): void {
    if (data.hasAccepted) {
      this.isSaveInProgress = true;
      const exportSettingPayload = QBOExportSettingModel.constructPayload(this.exportSettingForm);
      this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: QBOExportSettingGet) => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(QBOOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/qbo/onboarding/import_settings`]);
        } else if (this.isAdvancedSettingAffected()) {
          this.router.navigate(['/integrations/qbo/main/configuration/advanced_settings']);
        } else {
          this.router.navigate(['/integrations/qbo/main/dashboard']);
        }
      }, () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
    }
  }

  navigateToPreviousStep(): void {
    if (brandingFeatureConfig.featureFlags.mapEmployees) {
      this.router.navigate([`/integrations/qbo/onboarding/employee_settings`]);
    } else {
      this.router.navigate([`/integrations/qbo/onboarding/connector`]);
    }
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
    return this.exportSettings.workspace_general_settings.reimbursable_expenses_object !== null || this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object !== null;
  }

  private isSingleItemizedJournalEntryAffected(): boolean {
    return (this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== QBOReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.value.reimbursableExportType === QBOReimbursableExpensesObject.JOURNAL_ENTRY) || (this.exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object !== QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.value.creditCardExportType === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
  }

  private isPaymentsSyncAffected(): boolean {
    return this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== QBOReimbursableExpensesObject.BILL && this.exportSettingForm.value.reimbursableExportType  === QBOReimbursableExpensesObject.BILL;
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
      this.exportSettingForm.controls.creditCardExportGroup.setValue(ExpenseGroupingFieldOption.EXPENSE_ID);
      this.exportSettingForm.controls.creditCardExportGroup.disable();
    } else {
      this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();
      this.helperService.clearValidatorAndResetValue(this.exportSettingForm, 'creditCardExportGroup');
      this.helperService.enableFormField(this.exportSettingForm, 'creditCardExportGroup');
    }
  }

  private setupCustomWatchers(): void {
    if (this.exportSettingForm.value.creditCardExportType && [QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE, QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE].includes(this.exportSettingForm.value.creditCardExportType)) {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.value.creditCardExportType);
    }

    this.exportSettingService.creditCardExportTypeChange.subscribe((selectedValue: QBOCorporateCreditCardExpensesObject) => {
      this.showNameInJournalOption = selectedValue === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.updateCCCExpenseGroupingDateOptions(selectedValue);
    });
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];

    forkJoin({
      exportSetting: this.exportSettingService.getExportSettings(),
      destinationAttributes: this.mappingService.getGroupedDestinationAttributes(destinationAttributes, 'v1', 'qbo'),
      workspaceGeneralSettings: this.workspaceService.getWorkspaceGeneralSettings()
    }).subscribe(({exportSetting, destinationAttributes, workspaceGeneralSettings}) => {
      this.exportSettings = exportSetting;
      this.employeeFieldMapping = workspaceGeneralSettings.employee_field_mapping;

      this.bankAccounts = destinationAttributes.BANK_ACCOUNT.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.cccAccounts = destinationAttributes.CREDIT_CARD_ACCOUNT.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.accountsPayables = destinationAttributes.ACCOUNTS_PAYABLE.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.vendors = destinationAttributes.VENDOR.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);

      this.isImportItemsEnabled = workspaceGeneralSettings.import_items;

      this.reimbursableExportTypes = QBOExportSettingModel.getReimbursableExportTypeOptions(this.employeeFieldMapping);
      this.showNameInJournalOption = this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.exportSettingForm = QBOExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings, this.employeeFieldMapping);

      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);

      const [exportSettingValidatorRule, exportModuleRule] = QBOExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      if (this.exportSettings.workspace_general_settings.reimbursable_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[0], this.exportSettings.workspace_general_settings.reimbursable_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.workspace_general_settings.reimbursable_expenses_object, exportSettingValidatorRule.reimbursableExpense, this.exportSettingForm);
      }

      if (this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object) {
        this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[1], this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object);
        this.helperService.setOrClearValidators(this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object, exportSettingValidatorRule.creditCardExpense, this.exportSettingForm);
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
