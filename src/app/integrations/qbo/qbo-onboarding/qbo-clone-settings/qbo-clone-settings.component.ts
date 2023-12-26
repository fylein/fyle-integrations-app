import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { EmployeeSettingModel } from 'src/app/core/models/common/employee-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeFieldMapping, ExpenseGroupingFieldOption, QBOCorporateCreditCardExpensesObject, QBOReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOEmployeeSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { CloneSettingService } from 'src/app/core/services/common/clone-setting.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
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

  QBOReimbursableExpensesObject = QBOReimbursableExpensesObject;

  EmployeeFieldMapping = EmployeeFieldMapping;

  QBOCorporateCreditCardExpensesObject = QBOCorporateCreditCardExpensesObject;

  constructor(
    private cloneSettingService: CloneSettingService,
    private exportSettingService: QboExportSettingsService,
    public helperService: HelperService,
    private mappingService: MappingService,
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

  private setupPage(): void {
    this.setupOnboardingSteps();
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];

    forkJoin([
      this.cloneSettingService.getCloneSettings(),
      this.mappingService.getGroupedDestinationAttributes(destinationAttributes, 'v1', 'qbo')
    ]).subscribe(([cloneSetting, destinationAttributes]) => {
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

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
