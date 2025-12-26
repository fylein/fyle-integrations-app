import { Injectable, Output, EventEmitter, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NetSuiteExportSettingGet, NetSuiteExportSettingPost } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-export-setting.model';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ExportModuleRule, ExportSettingValidatorRule } from 'src/app/core/models/common/export-settings.model';
import { HelperUtility } from 'src/app/core/models/common/helper.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { CCCExpenseState, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, FyleField, NameInJournalEntry, NetSuiteCorporateCreditCardExpensesObject, NetsuiteReimbursableExpensesObject, SplitExpenseGrouping } from "../../../models/enum/enum.model";
import { ExportSettingsService } from '../../common/export-settings.service';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { DefaultDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';

@Injectable({
  providedIn: 'root'
})
export class NetsuiteExportSettingsService extends ExportSettingsService {

  private mandatoryFormController: string[] = [];

  @Output() creditCardExportTypeChange: EventEmitter<string> = new EventEmitter();

  private apiService: ApiService = inject(ApiService);

  private workspaceService: WorkspaceService = inject(WorkspaceService);

  getEmployeeFieldOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.employee'),
        value: FyleField.EMPLOYEE
      },
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.vendor'),
        value: FyleField.VENDOR
      }
    ];
  }

  getAutoMapEmplyeeOptions(): SelectFormOption[] {
    return  [
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.basedOnEmployeeEmailId'),
        value: 'EMAIL'
      },
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.basedOnEmployeeName'),
        value: 'NAME'
      },
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.basedOnEmployeeCode'),
        value: 'EMPLOYEE_CODE'
      }
    ];
  }

  getReimbursableExportTypeOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.bill'),
        value: NetSuiteCorporateCreditCardExpensesObject.BILL
      },
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.journalEntry'),
        value: NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY
      },
      {
          label: this.translocoService.translate('services.netsuiteExportSettings.expenseReport'),
          value: NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT
      }
    ];
  }

  getCreditCardExportTypes(selectedReimbursableExportType: NetsuiteReimbursableExpensesObject): SelectFormOption[] {

    const exportType = [
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.bill'),
        value: NetSuiteCorporateCreditCardExpensesObject.BILL
      },
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.creditCardCharge'),
        value: NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE
      },
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.expenseReport'),
        value: NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT
      },
      {
        label: this.translocoService.translate('services.netsuiteExportSettings.journalEntry'),
        value: NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY
      }
    ];
    const isExpenseReportAllowed =
      brandingFeatureConfig.featureFlags.exportSettings.isReimbursableExpensesAllowed &&
      (
        selectedReimbursableExportType === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT ||
        !selectedReimbursableExportType
      );
    if (!isExpenseReportAllowed) {
      return exportType.filter((item) => item.value !== NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT);
    }
    return exportType;
  }

  override getCCCExpenseStateOptions(): SelectFormOption[] {
      return [
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.approved'),
          value: CCCExpenseState.APPROVED
        },
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.closed'),
          value: CCCExpenseState.PAID
        }
      ];
  }

  override getReimbursableExpenseStateOptions(): SelectFormOption[] {
      return [
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.processing'),
          value: ExpenseState.PAYMENT_PROCESSING
        },
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.closed'),
          value: ExpenseState.PAID
        }
      ];
    }

    getExpenseGroupByOptions(): SelectFormOption[] {
      return [
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.expense'),
          value: ExpenseGroupingFieldOption.EXPENSE_ID
        },
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.expenseReport'),
          value: ExpenseGroupingFieldOption.CLAIM_NUMBER
        }
      ];
    }

    getNameInJournalOptions(): SelectFormOption[] {
      return [
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.merchantName'),
          value: NameInJournalEntry.MERCHANT
        },
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.employeeName'),
          value: NameInJournalEntry.EMPLOYEE
        }
      ];
    }

    getReimbursableExpenseGroupingDateOptions(): SelectFormOption[] {
      return [
        {
          label: this.translocoService.translate('common.currentDate'),
          value: ExportDateType.CURRENT_DATE
        },
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.verificationDate'),
          value: ExportDateType.VERIFIED_AT
        },
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.spendDate'),
          value: ExportDateType.SPENT_AT
        },
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.approvalDate'),
          value: ExportDateType.APPROVED_AT
        },
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.lastSpendDate'),
          value: ExportDateType.LAST_SPENT_AT
        }
      ];
    }

    getAdditionalCreditCardExpenseGroupingDateOptions(): SelectFormOption[] {
      return [
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.cardTransactionPostDate'),
          value: ExportDateType.POSTED_AT
        },
        {
          label: this.translocoService.translate('services.netsuiteExportSettings.spendDate'),
          value: ExportDateType.SPENT_AT
        }
      ];
    }

    static getMandatoryField(form: FormGroup, controllerName: string): boolean {
      switch (controllerName) {
        case 'bankAccount':
          return (form.controls.creditCardExportType.value === NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT || form.controls.reimbursableExportType.value === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT) || (form.controls.reimbursableExportType.value === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && form.controls.employeeFieldMapping.value === EmployeeFieldMapping.EMPLOYEE);
        case 'accountsPayable':
          return (form.controls.reimbursableExportType.value === NetsuiteReimbursableExpensesObject.BILL || form.controls.creditCardExportType.value === NetSuiteCorporateCreditCardExpensesObject.BILL) || (form.controls.reimbursableExportType.value === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && form.controls.employeeFieldMapping.value === EmployeeFieldMapping.VENDOR);
        case 'creditCardAccount':
          return form.controls.creditCardExportType && form.controls.creditCardExportType.value !== NetSuiteCorporateCreditCardExpensesObject.BILL;
        case 'defaultCreditCardVendor':
          return form.controls.creditCardExportType.value === NetSuiteCorporateCreditCardExpensesObject.BILL || form.controls.creditCardExportType.value === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE  || (form.controls.creditCardExportType.value === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY && form.controls.nameInJournalEntry.value === NameInJournalEntry.MERCHANT);
        case 'nameInJournalEntry':
          return form.controls.creditCardExportType && form.controls.creditCardExportType.value === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY;
        case 'splitExpenseGrouping':
          return brandingFeatureConfig.featureFlags.exportSettings.splitExpenseGrouping &&
            form.controls.creditCardExportType &&
            form.controls.creditCardExportType.value === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE;
        default:
          return false;
      }
    }

    static getValidators(): [ExportSettingValidatorRule, ExportModuleRule[]] {
      const exportSettingValidatorRule: ExportSettingValidatorRule = {
        reimbursableExpense: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'expenseState'],
        creditCardExpense: ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'cccExpenseState']
      };


      const isSplitExpenseGroupingRequired = brandingFeatureConfig.featureFlags.exportSettings.splitExpenseGrouping;
      const creditCardChargeRequiredFields = ['creditCardAccount', 'defaultCreditCardVendor'];
      if (isSplitExpenseGroupingRequired) {
        creditCardChargeRequiredFields.push('splitExpenseGrouping');
      }

      const exportModuleRule: ExportModuleRule[] = [
        {
          formController: 'reimbursableExportType',
          requiredValue: {
            [NetsuiteReimbursableExpensesObject.BILL]: ['accountsPayable'],
            [NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY]: ['accountsPayable', 'bankAccount'],
            [NetsuiteReimbursableExpensesObject.EXPENSE_REPORT]: ['bankAccount']
          }
        },
        {
          formController: 'creditCardExportType',
          requiredValue: {
            [NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE]: creditCardChargeRequiredFields,
            [NetSuiteCorporateCreditCardExpensesObject.BILL]: ['accountsPayable', 'defaultCreditCardVendor'],
            [NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: ['creditCardAccount', 'defaultCreditCardVendor', 'nameInJournalEntry'],
            [NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT]: ['bankAccount', 'creditCardAccount']
          }
        }
      ];

      return [exportSettingValidatorRule, exportModuleRule];
    }

    getEmployeeFieldMapping(employeeFieldMapping: string): string {
      return brandingFeatureConfig.featureFlags.exportSettings.isEmployeeMappingFixed ? EmployeeFieldMapping.VENDOR : employeeFieldMapping;
    }

    mapAPIResponseToFormGroup(exportSettings: NetSuiteExportSettingGet | null): FormGroup {
      return new FormGroup({
        expenseState: new FormControl(exportSettings?.expense_group_settings?.expense_state),
        employeeFieldMapping: new FormControl(exportSettings?.configuration?.employee_field_mapping ? this.getEmployeeFieldMapping(exportSettings?.configuration?.employee_field_mapping) : null),
        autoMapEmployees: new FormControl(exportSettings?.configuration?.auto_map_employees),
        reimbursableExpense: new FormControl(exportSettings?.configuration?.reimbursable_expenses_object ? true : false),
        reimbursableExportType: new FormControl(exportSettings?.configuration?.reimbursable_expenses_object),
        reimbursableExportGroup: new FormControl(this.getExportGroup(exportSettings?.expense_group_settings?.reimbursable_expense_group_fields)),
        reimbursableExportDate: new FormControl(exportSettings?.expense_group_settings?.reimbursable_export_date_type),
        cccExpenseState: new FormControl(exportSettings?.expense_group_settings?.ccc_expense_state),
        creditCardExpense: new FormControl(exportSettings?.configuration?.corporate_credit_card_expenses_object ? true : false),
        creditCardExportType: new FormControl(exportSettings?.configuration?.corporate_credit_card_expenses_object),
        creditCardExportGroup: new FormControl(this.getExportGroup(exportSettings?.expense_group_settings?.corporate_credit_card_expense_group_fields)),
        creditCardExportDate: new FormControl(exportSettings?.expense_group_settings?.ccc_export_date_type),
        bankAccount: new FormControl(exportSettings?.general_mappings?.reimbursable_account?.id ? exportSettings.general_mappings.reimbursable_account : null),
        CCCBankAccount: new FormControl(exportSettings?.general_mappings?.reimbursable_account?.id ? exportSettings.general_mappings.reimbursable_account : null),
        creditCardAccount: new FormControl(exportSettings?.general_mappings?.default_ccc_account?.id ? exportSettings.general_mappings.default_ccc_account : null),
        accountsPayable: new FormControl(exportSettings?.general_mappings?.accounts_payable?.id ? exportSettings.general_mappings.accounts_payable : null),
        CCCAccountsPayable: new FormControl(exportSettings?.general_mappings?.accounts_payable?.id ? exportSettings.general_mappings.accounts_payable : null),
        defaultCreditCardVendor: new FormControl(exportSettings?.general_mappings?.default_ccc_vendor?.id ? exportSettings.general_mappings.default_ccc_vendor : null),
        nameInJournalEntry: new FormControl(exportSettings?.configuration?.name_in_journal_entry ? exportSettings?.configuration.name_in_journal_entry : this.getNameInJournalOptions()[0].value),
        searchOption: new FormControl(''),
        splitExpenseGrouping: new FormControl(exportSettings?.expense_group_settings?.split_expense_grouping ? exportSettings.expense_group_settings.split_expense_grouping : SplitExpenseGrouping.MULTIPLE_LINE_ITEM)
      });
    }

    static constructPayload(exportSettingsForm: FormGroup): NetSuiteExportSettingPost {
      const emptyDestinationAttribute: DefaultDestinationAttribute = {id: null, name: null};

      let nameInJournalEntry;
      if (brandingFeatureConfig.featureFlags.exportSettings.nameInJournalEntry) {
        nameInJournalEntry = exportSettingsForm.get('nameInJournalEntry')?.value ? exportSettingsForm.get('nameInJournalEntry')?.value : NameInJournalEntry.EMPLOYEE;
      } else {
        nameInJournalEntry = NameInJournalEntry.MERCHANT;
      }

      if (brandingFeatureConfig.featureFlags.exportSettings.isEmployeeMappingFixed) {
        exportSettingsForm.controls.creditCardExpense.patchValue(true);
        exportSettingsForm.controls.employeeFieldMapping.patchValue(FyleField.VENDOR);
      }

      // 'Employee field mapping' is not visible to the user when CCC is exported as Expense report
      // In this case, hard-code its value to EMPLOYEE
      let employeeFieldMapping = exportSettingsForm.get('employeeFieldMapping')?.value;
      if (exportSettingsForm.get('creditCardExportType')?.value === NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT) {
        employeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
      }

      const exportSettingPayload: NetSuiteExportSettingPost = {
        expense_group_settings: {
          expense_state: exportSettingsForm.get('expenseState')?.value,
          ccc_expense_state: exportSettingsForm.get('cccExpenseState')?.value,
          reimbursable_expense_group_fields: exportSettingsForm.get('reimbursableExportGroup')?.value ? [exportSettingsForm.get('reimbursableExportGroup')?.value] : null,
          reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value,
          corporate_credit_card_expense_group_fields: exportSettingsForm.get('creditCardExportGroup')?.value ? [exportSettingsForm.get('creditCardExportGroup')?.value] : null,
          ccc_export_date_type: exportSettingsForm.get('creditCardExportDate')?.value,
          split_expense_grouping: exportSettingsForm.get('splitExpenseGrouping')?.value ? exportSettingsForm.get('splitExpenseGrouping')?.value : SplitExpenseGrouping.MULTIPLE_LINE_ITEM
        },
        configuration: {
          reimbursable_expenses_object: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('reimbursableExportType')?.value : null,
          corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExportType')?.value ? exportSettingsForm.get('creditCardExportType')?.value : null,
          employee_field_mapping: employeeFieldMapping,
          auto_map_employees: exportSettingsForm.get('autoMapEmployees')?.value,
          name_in_journal_entry: nameInJournalEntry
        },
        general_mappings: {
          reimbursable_account: exportSettingsForm.get('CCCBankAccount')?.value ?? exportSettingsForm.get('bankAccount')?.value ?? emptyDestinationAttribute,
          default_ccc_account: exportSettingsForm.get('creditCardAccount')?.value ? exportSettingsForm.get('creditCardAccount')?.value : emptyDestinationAttribute,
          accounts_payable: exportSettingsForm.get('CCCAccountsPayable')?.value ?? exportSettingsForm.get('accountsPayable')?.value ?? emptyDestinationAttribute,
          default_ccc_vendor: exportSettingsForm.get('defaultCreditCardVendor')?.value ? exportSettingsForm.get('defaultCreditCardVendor')?.value : emptyDestinationAttribute
        }
      };

      return exportSettingPayload;
    }

  getExportSettings(): Observable<NetSuiteExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: NetSuiteExportSettingPost): Observable<NetSuiteExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  setupDynamicValidators(form: FormGroup, values: ExportModuleRule, selectedValue: string): void {
    Object.entries(values.requiredValue).forEach(([key, value]) => {
      if (key === selectedValue) {
        value.forEach((formController: string) => {
          if (values.formController === 'creditCardExportType') {
            this.creditCardExportTypeChange.emit(selectedValue);
          }

          const isFieldMandatory = NetsuiteExportSettingsService.getMandatoryField(form, formController);
          if (isFieldMandatory) {
            if (!this.mandatoryFormController.includes(formController)) {
              this.mandatoryFormController.push(formController);
            }
            HelperUtility.markControllerAsRequired(form, formController);
          } else {
            HelperUtility.clearValidatorAndResetValue(form, formController);
          }
        });
      } else {
        value.forEach((formController: string) => {
          if (!this.mandatoryFormController.includes(formController)) {
            HelperUtility.clearValidatorAndResetValue(form, formController);
          }
        });
      }
    });
  }

  setExportTypeValidatorsAndWatchers(exportTypeValidatorRule: ExportModuleRule[], form: FormGroup): void {
    this.mandatoryFormController = [];
    Object.values(exportTypeValidatorRule).forEach((values) => {
      form.controls[values.formController].valueChanges.subscribe((selectedValue) => {
        this.setupDynamicValidators(form, values, selectedValue);
      });
    });
  }
}
