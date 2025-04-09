import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AdvancedSettingsModel, EmailOption } from 'src/app/core/models/common/advanced-settings.model';
import { EmployeeSettingModel } from 'src/app/core/models/common/employee-settings.model';
import { ExpenseField, ImportCodeFieldConfigType, ImportSettingsModel } from 'src/app/core/models/common/import-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, AutoMapEmployeeOptions, ConfigurationCta, ConfigurationWarningEvent, DefaultImportFields, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExportDateType, InputType, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QBOField, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { Org } from 'src/app/core/models/org/org.model';
import { QBOAdvancedSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-advanced-setting.model';
import { QBOCloneSetting, QBOCloneSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-clone-setting.model';
import { QBOEmployeeSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { QBOImportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { CloneSettingService } from 'src/app/core/services/common/clone-setting.service';
import { ConfigurationService } from 'src/app/core/services/common/configuration.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';

@Component({
  selector: 'app-qbo-clone-settings',
  templateUrl: './qbo-clone-settings.component.html',
  styleUrls: ['./qbo-clone-settings.component.scss']
})
export class QboCloneSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  isLoading: boolean = true;

  brandingConfig = brandingConfig;

  employeeMappingOptions: SelectFormOption[] = EmployeeSettingModel.getEmployeeFieldMappingOptions();

  autoMapEmployeeOptions: SelectFormOption[] = QBOEmployeeSettingModel.getAutoMapEmployeeOptions();

  employeeSettingForm: FormGroup;

  exportSettingForm: FormGroup;

  importSettingForm: FormGroup;

  advancedSettingForm: FormGroup;

  showCustomFieldDialog: boolean;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required]
  });

  customFieldType: string;

  customFieldControl: AbstractControl;

  customField: ExpenseField;

  customFieldOption: ExpenseField[] = ImportSettingsModel.getCustomFieldOption();

  isPreviewDialogVisible: boolean;

  bankAccounts: DefaultDestinationAttribute[];

  cccAccounts: DefaultDestinationAttribute[];

  accountsPayables: DefaultDestinationAttribute[];

  vendors: DefaultDestinationAttribute[];

  expenseAccounts: DefaultDestinationAttribute[];

  taxCodes: DefaultDestinationAttribute[];

  billPaymentAccounts: DefaultDestinationAttribute[];

  isImportMerchantsAllowed: boolean;

  isTaxGroupSyncAllowed: boolean;

  isImportItemsEnabled: boolean;

  reimbursableExportTypes: SelectFormOption[];

  creditCardExportTypes = QBOExportSettingModel.getCreditCardExportTypes();

  cccExpenseStateOptions = QBOExportSettingModel.getCCCExpenseStateOptions();

  expenseStateOptions = QBOExportSettingModel.getReimbursableExpenseStateOptions();

  expenseGroupByOptions = QBOExportSettingModel.getExpenseGroupByOptions();

  reimbursableExpenseGroupingDateOptions = QBOExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat();

  nameInJournalOptions = QBOExportSettingModel.getNameInJournalOptions();

  chartOfAccountTypesList: string[] = QBOImportSettingModel.getChartOfAccountTypesList();

  showNameInJournalOption: boolean;

  qboFields: IntegrationField[];

  fyleFields: FyleField[];

  cloneSetting: QBOCloneSetting;

  appName: AppName = AppName.QBO;

  memoStructure: string[] = [];

  memoPreviewText: string = '';

  isSaveInProgress: boolean;

  defaultMemoOptions: string[] = AdvancedSettingsModel.getDefaultMemoOptions();

  paymentSyncOptions: SelectFormOption[] = QBOAdvancedSettingModel.getPaymentSyncOptions();

  adminEmails: EmailOption[] = [];

  warningHeaderText: string;

  warningContextText: string;

  primaryButtonText: string;

  warningEvent: ConfigurationWarningEvent;

  isWarningDialogVisible: boolean;

  QBOReimbursableExpensesObject = QBOReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  QBOCorporateCreditCardExpensesObject = QBOCorporateCreditCardExpensesObject;

  ConfigurationCtaText = ConfigurationCta;

  InputType = InputType;

  splitExpenseGroupingOptions = QBOExportSettingModel.getSplitExpenseGroupingOptions();

  org: Org = this.orgService.getCachedOrg();

  scheduleIntervalHours: SelectFormOption[] = [...Array(24).keys()].map(day => {
    return {
      label: (day + 1).toString(),
      value: day + 1
    };
  });

  DefaultImportFields = DefaultImportFields;

  importCodeSelectorOptions: Record<string, { label: string; value: boolean; subLabel: string; }[]> = {
    "ACCOUNT": [
      {
        label: 'Import codes + names',
        value: true,
        subLabel: 'Example: 4567 Meals & Entertainment'
      },
      {
        label: 'Import names only',
        value: false,
        subLabel: 'Example: Meals & Entertainment'
      }
    ]
  };

  readonly AppName = AppName;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.netsuite.configuration.advancedSettings;

  qboImportCodeFieldCodeConfig: ImportCodeFieldConfigType;

  cloneQboImportCodeFieldCodeConfig: ImportCodeFieldConfigType;

  readonly brandingStyle = brandingStyle;

  constructor(
    private cloneSettingService: CloneSettingService,
    private configurationService: ConfigurationService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private exportSettingService: QboExportSettingsService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private qboConnectorService: QboConnectorService,
    private qboImportSettingsService: QboImportSettingsService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private orgService: OrgService
  ) { }

  resetCloneSetting(): void {
    this.warningHeaderText = 'Are you sure?';
    this.warningContextText = `By resetting the configuration, you will be configuring each setting individually from the beginning.`;
    this.primaryButtonText = 'Yes';
    this.warningEvent = ConfigurationWarningEvent.RESET_CONFIGURATION;

    this.isWarningDialogVisible = true;
  }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isWarningDialogVisible = false;
    if (data.hasAccepted) {
      this.router.navigate([`/integrations/qbo/onboarding/export_settings`]);
    }
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbo/onboarding/connector`]);
  }

  closeModel() {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = false;
  }

  showPreviewDialog(visible: boolean) {
    this.isPreviewDialogVisible = visible;
  }

  closeDialog() {
    this.isPreviewDialogVisible = false;
  }

  saveFyleExpenseField(): void {
    this.customField = {
      attribute_type: this.customFieldForm.get('attribute_type')?.value.split(' ').join('_').toUpperCase(),
      display_name: this.customFieldForm.get('attribute_type')?.value,
      source_placeholder: this.customFieldForm.get('source_placeholder')?.value,
      is_dependent: false
    };

    if (this.customFieldControl) {
      this.fyleFields.pop();
      this.fyleFields.push(this.customField);
      this.fyleFields.push(this.customFieldOption[0]);
      const expenseField = {
        source_field: this.customField.attribute_type,
        destination_field: this.customFieldControl.get('destination_field')?.value,
        import_to_fyle: true,
        is_custom: true,
        source_placeholder: this.customField.source_placeholder
      };
      (this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0].patchValue(expenseField);
      ((this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0] as FormGroup).controls.import_to_fyle.disable();
      this.customFieldForm.reset();
      this.showCustomFieldDialog = false;
    }
  }

  save(): void {
    this.isSaveInProgress = true;
    const cloneSettingPayload = QBOCloneSettingModel.constructPayload(this.employeeSettingForm, this.exportSettingForm, this.importSettingForm, this.advancedSettingForm, this.isTaxGroupSyncAllowed);

    this.cloneSettingService.postCloneSettings(cloneSettingPayload).subscribe((response) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Cloned settings successfully');
      this.router.navigate([`/integrations/qbo/onboarding/done`]);
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Failed to clone settings');
    });

  }

  isAutoCreateVendorsFieldVisible(): boolean {
    return this.cloneSetting.employee_mappings.workspace_general_settings.employee_field_mapping === EmployeeFieldMapping.VENDOR && this.cloneSetting.employee_mappings.workspace_general_settings.auto_map_employees !== null && this.cloneSetting.employee_mappings.workspace_general_settings.auto_map_employees !== AutoMapEmployeeOptions.EMPLOYEE_CODE;
  }

  isPaymentSyncFieldVisible(): boolean {
    return this.cloneSetting.export_settings.workspace_general_settings.reimbursable_expenses_object === QBOReimbursableExpensesObject.BILL;
  }

  isSingleCreditLineJEFieldVisible(): boolean {
    return this.cloneSetting.export_settings.workspace_general_settings.reimbursable_expenses_object === QBOReimbursableExpensesObject.JOURNAL_ENTRY || this.cloneSetting.export_settings.workspace_general_settings.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY;
  }

  isAutoCreateMerchantsAsVendorsFieldVisible(): boolean {
    return !this.cloneSetting.import_settings.workspace_general_settings.import_vendors_as_merchants && (this.cloneSetting.export_settings.workspace_general_settings.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || this.cloneSetting.export_settings.workspace_general_settings.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE || this.cloneSetting.export_settings.workspace_general_settings.name_in_journal_entry === NameInJournalEntry.MERCHANT);
  }

  private setupOnboardingSteps(): void {
    const onboardingSteps = new QBOOnboardingModel().getOnboardingSteps('Clone settings', this.workspaceService.getOnboardingState());
    this.onboardingSteps.push(onboardingSteps[0]);
    this.onboardingSteps.push({
      active: false,
      completed: false,
      step: 'Clone settings',
      icon: 'gear-medium',
      route: '/integrations/qbo/onboarding/clone_settings',
      styleClasses: ['step-name-export--text']
    });
  }

  private setupCustomWatchers(): void {
    if (this.exportSettingForm.get('creditCardExportType')?.value) {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.get('creditCardExportType')?.value);
    }

    this.exportSettingService.creditCardExportTypeChange.subscribe((selectedValue: QBOCorporateCreditCardExpensesObject) => {
      this.showNameInJournalOption = selectedValue === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.updateCCCExpenseGroupingDateOptions(selectedValue);
    });
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
      this.helperService.clearValidatorAndResetValue(this.exportSettingForm, 'creditCardExportGroup');
      this.helperService.enableFormField(this.exportSettingForm, 'creditCardExportGroup');
    }
    const allowedValues = this.cccExpenseGroupingDateOptions.map(option => option.value);
    if (!allowedValues.includes(this.exportSettingForm.get('creditCardExportDate')?.value)) {
      this.exportSettingForm.get('creditCardExportDate')?.setValue(null);
    }
  }

  private initializeCustomFieldForm(shouldShowDialog: boolean) {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = shouldShowDialog;
  }

  private createTaxCodeWatcher(): void {
    this.importSettingForm.controls.taxCode.valueChanges.subscribe((isTaxCodeEnabled) => {
      if (isTaxCodeEnabled) {
        this.importSettingForm.controls.defaultTaxCode.setValidators(Validators.required);
      } else {
        this.importSettingForm.controls.defaultTaxCode.clearValidators();
        this.importSettingForm.controls.defaultTaxCode.setValue(null);
      }
    });
  }

  updateImportCodeFields(isImportCodeEnabled: boolean, value: string): void {
    let fields = this.importSettingForm.get('importCodeFields')?.value;
    if (!isImportCodeEnabled && this.qboImportCodeFieldCodeConfig[value]) {
      fields = fields.filter((field: string) => field !== value);
    } else if (isImportCodeEnabled && !fields.includes(value)) {
      fields.push(value);
    }
    this.importSettingForm.get('importCodeFields')?.patchValue(fields);
  }

  private createCOAWatcher(): void {
    this.importSettingForm.controls.importCategories.valueChanges.subscribe((isImportCategoriesEnabled) => {
      if (!isImportCategoriesEnabled) {
        this.importSettingForm.controls.chartOfAccountTypes.setValue(['Expense']);
        this.importSettingForm.controls.importCategoryCode.clearValidators();
        this.importSettingForm.controls.importCategoryCode.setValue(ImportSettingsModel.getImportCodeField(this.cloneSetting.import_settings.workspace_general_settings.import_code_fields, DefaultImportFields.ACCOUNT, this.cloneQboImportCodeFieldCodeConfig));
      } if (isImportCategoriesEnabled) {
		    this.helperService.markControllerAsRequired(this.importSettingForm, 'importCategoryCode');
      }
    });
  }

  private importCategroyCodeWatcher(): void {
    this.importSettingForm.controls.importCategoryCode.valueChanges.subscribe((isImportCategorieCode) => {
      if (isImportCategorieCode && this.importSettingForm.controls.importCategories) {
          this.updateImportCodeFields(true, DefaultImportFields.ACCOUNT);
        } else {
          this.updateImportCodeFields(false, DefaultImportFields.ACCOUNT);
        }
    });
  }

  private setupImportSettingFormWatcher(): void {
    this.createTaxCodeWatcher();
    this.createCOAWatcher();
    this.importCategroyCodeWatcher();
    const expenseFieldArray = this.importSettingForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control:any) => {
      control.valueChanges.subscribe((value: { source_field: string; destination_field: string; }) => {
        if (value.source_field === 'custom_field') {
          this.initializeCustomFieldForm(true);
          this.customFieldType = '';
          this.customFieldControl = control;
          this.customFieldControl.patchValue({
            source_field: '',
            destination_field: control.get('destination_field')?.value,
            import_to_fyle: control.get('import_to_fyle')?.value,
            is_custom: control.get('is_custom')?.value,
            source_placeholder: null
          });
        }
      });
    });
  }

  onMultiSelectChange() {
    const memo = this.advancedSettingForm.controls.memoStructure.value;
    const changedMemo = AdvancedSettingsModel.formatMemoPreview(memo, this.defaultMemoOptions)[1];
    this.advancedSettingForm.controls.memoStructure.patchValue(changedMemo);
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.cloneSetting.advanced_configurations.workspace_general_settings.memo_structure;
    const memo = AdvancedSettingsModel.formatMemoPreview(this.memoStructure, this.defaultMemoOptions);
    this.memoPreviewText = memo[0];
    this.advancedSettingForm.controls.memoStructure.patchValue(memo[1]);
    this.advancedSettingForm.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
       this.memoPreviewText = AdvancedSettingsModel.formatMemoPreview(memoChanges, this.defaultMemoOptions)[0];
    });
  }

  private setupAdvancedSettingFormWatcher() {
    this.createMemoStructureWatcher();

    QBOAdvancedSettingModel.setConfigurationSettingValidatorsAndWatchers(this.advancedSettingForm);
  }

  private setupPage(): void {
    this.setupOnboardingSteps();
    const destinationAttributes = [
      QBOField.BANK_ACCOUNT, QBOField.CREDIT_CARD_ACCOUNT, QBOField.ACCOUNTS_PAYABLE, QBOField.VENDOR, QBOField.TAX_CODE
    ];

    forkJoin([
      this.cloneSettingService.getCloneSettings(),
      this.mappingService.getGroupedDestinationAttributes(destinationAttributes, 'v1', 'qbo'),
      this.mappingService.getFyleFields('v1'),
      this.qboConnectorService.getQBOCredentials(),
      this.configurationService.getAdditionalEmails(),
      this.qboImportSettingsService.getQBOFields(),
      this.qboImportSettingsService.getImportCodeFieldConfig()
    ]).subscribe(([cloneSetting, destinationAttributes, fyleFieldsResponse, qboCredentials, adminEmails, qboFields, qboImportCodeFieldCodeConfig]) => {

      const workspaceId = +this.workspaceService.getWorkspaceId();
      this.workspaceService.setWorkspaceId(cloneSetting.workspace_id);

      this.qboImportSettingsService.getImportCodeFieldConfig().subscribe((cloneQboImportCodeFieldCodeConfig) => {
        this.cloneSetting = cloneSetting;
        this.workspaceService.setWorkspaceId(workspaceId);

        // Employee Settings
        this.employeeSettingForm = QBOEmployeeSettingModel.parseAPIResponseToFormGroup(cloneSetting.employee_mappings);

        // Export Settings
        this.bankAccounts = destinationAttributes.BANK_ACCOUNT.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
        this.cccAccounts = destinationAttributes.CREDIT_CARD_ACCOUNT.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
        this.accountsPayables = destinationAttributes.ACCOUNTS_PAYABLE.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
        this.vendors = destinationAttributes.VENDOR.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
        this.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);

        this.isImportItemsEnabled = cloneSetting.import_settings.workspace_general_settings.import_items;

        this.reimbursableExportTypes = QBOExportSettingModel.getReimbursableExportTypeOptions(cloneSetting.employee_mappings.workspace_general_settings.employee_field_mapping);
        this.showNameInJournalOption = cloneSetting.export_settings.workspace_general_settings?.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;
        this.exportSettingForm = QBOExportSettingModel.mapAPIResponseToFormGroup(cloneSetting.export_settings, cloneSetting.employee_mappings.workspace_general_settings.employee_field_mapping);

        this.helperService.addExportSettingFormValidator(this.exportSettingForm);

        const [exportSettingValidatorRule, exportModuleRule] = QBOExportSettingModel.getValidators();

        this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

        if (cloneSetting.export_settings.workspace_general_settings.reimbursable_expenses_object) {
          this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[0], cloneSetting.export_settings.workspace_general_settings.reimbursable_expenses_object);
        }

        if (cloneSetting.export_settings.workspace_general_settings.corporate_credit_card_expenses_object) {
          this.exportSettingService.setupDynamicValidators(this.exportSettingForm, exportModuleRule[1], cloneSetting.export_settings.workspace_general_settings.corporate_credit_card_expenses_object);
        }

        this.exportSettingService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

        this.setupCustomWatchers();


        // Import Settings
        this.qboFields = qboFields;
        this.taxCodes = destinationAttributes.TAX_CODE.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
        this.isImportMerchantsAllowed = !cloneSetting.advanced_configurations.workspace_general_settings.auto_create_merchants_as_vendors;

        if (qboCredentials && qboCredentials.country !== 'US') {
          this.isTaxGroupSyncAllowed = true;
        }
        this.qboImportCodeFieldCodeConfig = qboImportCodeFieldCodeConfig;
        this.cloneQboImportCodeFieldCodeConfig = cloneQboImportCodeFieldCodeConfig;
        this.importSettingForm = QBOImportSettingModel.mapAPIResponseToFormGroup(cloneSetting.import_settings, this.qboFields, this.cloneQboImportCodeFieldCodeConfig);
        this.fyleFields = fyleFieldsResponse;
        this.fyleFields.push({ attribute_type: 'custom_field', display_name: 'Create a custom field', is_dependent: false });
        this.setupImportSettingFormWatcher();
        this.initializeCustomFieldForm(false);

        // Advanced Settings
        this.adminEmails = adminEmails;
        if (this.cloneSetting.advanced_configurations.workspace_schedules?.additional_email_options && this.cloneSetting.advanced_configurations.workspace_schedules?.additional_email_options.length > 0) {
          this.adminEmails = this.adminEmails.concat(this.cloneSetting.advanced_configurations.workspace_schedules?.additional_email_options);
        }

        this.billPaymentAccounts = destinationAttributes.BANK_ACCOUNT.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
        this.advancedSettingForm = QBOAdvancedSettingModel.mapAPIResponseToFormGroup(this.cloneSetting.advanced_configurations, false, this.adminEmails, this.helperService.shouldAutoEnableAccountingPeriod(this.org.created_at));

        this.setupAdvancedSettingFormWatcher();

        this.defaultMemoOptions = AdvancedSettingsModel.getMemoOptions(this.cloneSetting.export_settings, AppName.QBO);

        this.isLoading = false;
      });
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
