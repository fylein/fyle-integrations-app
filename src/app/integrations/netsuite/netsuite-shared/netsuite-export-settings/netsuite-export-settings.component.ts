import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, FyleField, IntacctReimbursableExpensesObject, NetSuiteCorporateCreditCardExpensesObject, NetsuiteOnboardingState, NetsuiteReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ExportSettingFormOption } from 'src/app/core/models/intacct/intacct-configuration/export-settings.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { NetSuiteExportSettingGet, NetSuiteExportSettingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-export-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
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

  accountsPayables: DefaultDestinationAttribute[];

  vendors: DefaultDestinationAttribute[];

  isImportItemsEnabled: boolean;

  reimbursableExportTypes: SelectFormOption[];

  autoMapEmployeeOptions: ExportSettingFormOption[] = [
    { label: 'Based on Employee E-mail ID', value: 'EMAIL' },
    { label: 'Based on Employee Name', value: 'NAME' },
    { label: 'Based on Employee Code', value: 'EMPLOYEE_CODE' }
  ];

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

  readonly brandingContent = brandingContent.configuration.exportSetting;

  NetSuiteCorporateCreditCardExpensesObject = NetSuiteCorporateCreditCardExpensesObject;

  NetSuiteReimbursableExpensesObject = NetsuiteReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  previewImagePaths =[
    {
      [NetsuiteReimbursableExpensesObject.EXPENSE_REPORT]: 'assets/pngs/preview-screens/qbo-reimburse-expense.png',
      [NetsuiteReimbursableExpensesObject.BILL]: 'assets/pngs/preview-screens/qbo-reimburse-bill.png',
      [NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY]: 'assets/pngs/preview-screens/qbo-reimburse-journal-entry.png'
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
    private netsuiteHelperServie: NetsuiteHelperService,
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

  private reimbursableExportTypeWatcher(): void {
    this.exportSettingForm.controls.reimbursableExportType.valueChanges.subscribe((isreimbursableExportTypeSelected) => {
      if (isreimbursableExportTypeSelected === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY) {
        this.exportSettingForm.controls.employeeFieldMapping.enable();
      }

      if (isreimbursableExportTypeSelected === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT) {
        this.exportSettingForm.controls.employeeFieldMapping.patchValue(FyleField.EMPLOYEE);
        this.exportSettingForm.controls.employeeFieldMapping.disable();
      }

      if (isreimbursableExportTypeSelected === NetsuiteReimbursableExpensesObject.BILL) {
        this.exportSettingForm.controls.employeeFieldMapping.patchValue(FyleField.VENDOR);
        this.exportSettingForm.controls.employeeFieldMapping.disable();
      }
    });
  }

  private createReimbursableExpenseWatcher(): void {
    this.exportSettingForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
      if (isReimbursableExpenseSelected) {
        this.exportSettingForm.controls.reimbursableExportType.setValidators(Validators.required);
        this.exportSettingForm.controls.reimbursableExportGroup.setValidators(Validators.required);
        this.exportSettingForm.controls.reimbursableExportDate.setValidators(Validators.required);
        this.exportSettingForm.controls.expenseState.setValidators(Validators.required);
      } else {
        this.exportSettingForm.controls.reimbursableExportType.clearValidators();
        this.exportSettingForm.controls.reimbursableExportGroup.clearValidators();
        this.exportSettingForm.controls.reimbursableExportDate.clearValidators();
        this.exportSettingForm.controls.expenseState.clearValidators();
        this.exportSettingForm.controls.reimbursableExportType.setValue(null);
      }
    });
    this.reimbursableExportTypeWatcher();
  }

  private exportFieldsWatcher(): void {
    if (this.exportSettings?.configuration?.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY || this.exportSettings?.configuration?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY) {
      this.exportSettingForm.get('employeeFieldMapping')?.enable();
    } else {
      this.exportSettingForm.get('employeeFieldMapping')?.disable();
    }

    if (this.exportSettings?.configuration?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE) {
      this.exportSettingForm.controls.cccExportGroup.setValue(this.expenseGroupByOptions[0].value);
      this.exportSettingForm.controls.cccExportGroup.disable();
    }
    this.createReimbursableExpenseWatcher();
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
    if (data.hasAccepted) {
      this.isSaveInProgress = true;
      const exportSettingPayload = NetSuiteExportSettingModel.constructPayload(this.exportSettingForm);
      this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: NetSuiteExportSettingGet) => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');

        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(NetsuiteOnboardingState.IMPORT_SETTINGS);
          this.router.navigate([`/integrations/netsuite/onboarding/import_settings`]);
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
    this.router.navigate([`/integrations/netsuite/onboarding/connector`]);
  }

  save(): void {
    this.constructPayloadAndSave({hasAccepted: true, event: ConfigurationWarningEvent.NETSUITE_EXPORT_SETTINGS});
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
    const existingReimbursableExportType = this.exportSettings.configuration?.reimbursable_expenses_object ? this.exportSettings.configuration.reimbursable_expenses_object : 'None';
    const existingCorporateCardExportType = this.exportSettings.configuration?.corporate_credit_card_expenses_object ? this.exportSettings.configuration.corporate_credit_card_expenses_object : 'None';
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
    return this.exportSettings.configuration.reimbursable_expenses_object !== null || this.exportSettings.configuration.corporate_credit_card_expenses_object !== null;
  }

  private isSingleItemizedJournalEntryAffected(): boolean {
    return (this.exportSettings?.configuration?.reimbursable_expenses_object !== NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.value.reimbursableExportType === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY) || (this.exportSettings?.configuration?.corporate_credit_card_expenses_object !== NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.exportSettingForm.value.creditCardExportType === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
  }

  private isPaymentsSyncAffected(): boolean {
    return this.exportSettings?.configuration?.reimbursable_expenses_object !== NetsuiteReimbursableExpensesObject.BILL && this.exportSettingForm.value.reimbursableExportType  === NetsuiteReimbursableExpensesObject.BILL;
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
    forkJoin({
      exportSetting: this.exportSettingService.getExportSettings()
    }).subscribe(({exportSetting}) => {
      this.exportSettings = exportSetting;

      this.reimbursableExportTypes = NetSuiteExportSettingModel.getReimbursableExportTypeOptions();
      this.showNameInJournalOption = this.exportSettings.configuration?.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.exportSettingForm = NetSuiteExportSettingModel.mapAPIResponseToFormGroup(this.exportSettings);

      if (!this.brandingFeatureConfig.featureFlags.exportSettings.reimbursableExpenses) {
        this.exportSettingForm.controls.creditCardExpense.patchValue(true);
      }

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);

      this.exportFieldsWatcher();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }
}
