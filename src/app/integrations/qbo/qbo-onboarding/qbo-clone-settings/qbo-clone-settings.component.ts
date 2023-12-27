import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { EmployeeSettingModel } from 'src/app/core/models/common/employee-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, EmployeeFieldMapping, ExpenseGroupingFieldOption, InputType, QBOCorporateCreditCardExpensesObject, QBOField, QBOReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOCloneSetting } from 'src/app/core/models/qbo/qbo-configuration/qbo-clone-setting.model';
import { QBOEmployeeSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { QBOImportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { CloneSettingService } from 'src/app/core/services/common/clone-setting.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';

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

  showCustomFieldDialog: boolean;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required]
  });

  customFieldType: string;

  customFieldControl: AbstractControl;

  bankAccounts: DefaultDestinationAttribute[];

  cccAccounts: DefaultDestinationAttribute[];

  accountsPayables: DefaultDestinationAttribute[];

  vendors: DefaultDestinationAttribute[];

  expenseAccounts: DefaultDestinationAttribute[];

  taxCodes: DefaultDestinationAttribute[];

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

  QBOReimbursableExpensesObject = QBOReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  QBOCorporateCreditCardExpensesObject = QBOCorporateCreditCardExpensesObject;

  InputType = InputType;

  constructor(
    private cloneSettingService: CloneSettingService,
    private formBuilder: FormBuilder,
    private exportSettingService: QboExportSettingsService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private qboConnectorService: QboConnectorService,
    private workspaceService: WorkspaceService
  ) { }

  private setupOnboardingSteps(): void {
    const onboardingSteps = new QBOOnboardingModel().getOnboardingSteps('Clone Settings', this.workspaceService.getOnboardingState());
    this.onboardingSteps.push(onboardingSteps[0]);
    this.onboardingSteps.push({
      active: false,
      completed: false,
      number: 6,
      step: 'Clone Settings',
      icon: 'advanced-setting',
      route: '/integrations/qbo/onboarding/clone_settings',
      size: {
        height: '20px',
        width: '20px'
      },
      styleClasses: ['step-name-export--text', 'step-name-advanced--icon']
    });
  }

  private setupCustomWatchers(): void {
    if (this.exportSettingForm.value.creditCardExportType) {
      this.updateCCCExpenseGroupingDateOptions(this.exportSettingForm.value.creditCardExportType);
    }

    this.exportSettingService.creditCardExportTypeChange.subscribe((selectedValue: QBOCorporateCreditCardExpensesObject) => {
      this.showNameInJournalOption = selectedValue === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY ? true : false;

      this.updateCCCExpenseGroupingDateOptions(selectedValue);
    });
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

  private setupImportSettingFormWatcher(): void {
    this.createTaxCodeWatcher();
    const expenseFieldArray = this.importSettingForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control:any) => {
      control.valueChanges.subscribe((value: { source_field: string; destination_field: string; }) => {
        if (value.source_field === 'custom_field') {
          this.initializeCustomFieldForm(true);
          this.customFieldType = '';
          this.customFieldControl = control;
          this.customFieldControl.patchValue({
            source_field: '',
            destination_field: control.value.destination_field,
            import_to_fyle: control.value.import_to_fyle,
            is_custom: control.value.is_custom,
            source_placeholder: null
          });
        }
      });
    });
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
    ]).subscribe(([cloneSetting, destinationAttributes, fyleFieldsResponse, qboCredentials]) => {
      this.cloneSetting = cloneSetting;

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
      this.qboFields = QBOImportSettingModel.getQBOFields();
      this.taxCodes = destinationAttributes.TAX_CODE.map((option: DestinationAttribute) => QBOExportSettingModel.formatGeneralMappingPayload(option));
      this.isImportMerchantsAllowed = !cloneSetting.advanced_configurations.workspace_general_settings.auto_create_merchants_as_vendors;

      if (qboCredentials && qboCredentials.country !== 'US') {
        this.isTaxGroupSyncAllowed = true;
      }

      this.importSettingForm = QBOImportSettingModel.mapAPIResponseToFormGroup(cloneSetting.import_settings);
      this.fyleFields = fyleFieldsResponse;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: 'Create a Custom Field', is_dependent: true });
      this.setupImportSettingFormWatcher();
      this.initializeCustomFieldForm(false);

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
