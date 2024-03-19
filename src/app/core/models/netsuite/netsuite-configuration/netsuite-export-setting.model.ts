import { FormControl, FormGroup } from "@angular/forms";
import { ExportModuleRule, ExportSettingModel, ExportSettingValidatorRule } from "../../common/export-settings.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { ExpenseGroupSettingGet, ExpenseGroupSettingPost } from "../../db/expense-group-setting.model";
import { CCCExpenseState, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, FyleField, NameInJournalEntry, NetSuiteCorporateCreditCardExpensesObject, NetsuiteReimbursableExpensesObject } from "../../enum/enum.model";
import { brandingFeatureConfig } from "src/app/branding/branding-config";
import { ExportSettingFormOption } from "../../intacct/intacct-configuration/export-settings.model";
import { disable } from "@rxweb/reactive-form-validators";


export type NetsuiteExportSettingWorkspaceGeneralSettingPost = {
    employee_field_mapping: EmployeeFieldMapping,
    reimbursable_expenses_object: NetsuiteReimbursableExpensesObject | null,
    auto_map_employees: ExportSettingFormOption | null,
    corporate_credit_card_expenses_object: NetSuiteCorporateCreditCardExpensesObject | null
    name_in_journal_entry: NameInJournalEntry;
}


export type NetsuiteExportSettingGeneralMapping = {
    reimbursable_account: DefaultDestinationAttribute,
    default_ccc_account: DefaultDestinationAttribute,
    accounts_payable: DefaultDestinationAttribute,
    default_ccc_vendor: DefaultDestinationAttribute
}


export type NetSuiteExportSettingPost = {
    expense_group_settings: ExpenseGroupSettingPost,
    configuration: NetsuiteExportSettingWorkspaceGeneralSettingPost,
    general_mappings: NetsuiteExportSettingGeneralMapping
  }


export type NetSuiteExportSettingGet = {
    expense_group_settings: ExpenseGroupSettingGet,
    configuration: NetsuiteExportSettingWorkspaceGeneralSettingPost,
    general_mappings: NetsuiteExportSettingGeneralMapping,
    workspace_id: number
}


export class NetSuiteExportSettingModel extends ExportSettingModel {

    static getEmployeeFieldOptions(): SelectFormOption[] {
      return [
        {
          label: 'Employee',
          value: FyleField.EMPLOYEE
        },
        {
          label: 'Vendor',
          value: FyleField.VENDOR
        }
      ];
    }

    static getAutoMapEmplyeeOptions(): SelectFormOption[] {
      return  [
        {
          label: 'Based on Employee E-mail ID',
          value: 'EMAIL'
        },
        {
          label: 'Based on Employee Name',
          value: 'NAME'
        },
        {
          label: 'Based on Employee Code',
          value: 'EMPLOYEE_CODE'
        }
      ];
    }

    static getReimbursableExportTypeOptions(): SelectFormOption[] {
      return [
        {
          label: 'Bill',
          value: NetSuiteCorporateCreditCardExpensesObject.BILL
        },
        {
          label: 'Journal Entry',
          value: NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY
        },
        {
            label: 'Expense Report',
            value: NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT
        }
      ];
    }

    static getCreditCardExportTypes(): SelectFormOption[] {
      return [
        {
          label: 'Bill',
          value: NetSuiteCorporateCreditCardExpensesObject.BILL
        },
        {
          label: 'Credit Card Charge',
          value: NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE
        },
        {
          label: 'Journal Entry',
          value: NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY
        },
        {
            label: 'Expense Report',
            value: NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT
        }
      ];
    }

    static getCCCExpenseStateOptions(): SelectFormOption[] {
        return [
          {
            label: 'Approved',
            value: CCCExpenseState.APPROVED
          },
          {
            label: 'Closed',
            value: CCCExpenseState.PAID
          }
        ];
    }

    static getReimbursableExpenseStateOptions(): SelectFormOption[] {
        return [
          {
            label: 'Processing',
            value: ExpenseState.PAYMENT_PROCESSING
          },
          {
            label: 'Closed',
            value: ExpenseState.PAID
          }
        ];
      }

      static getExpenseGroupByOptions(): SelectFormOption[] {
        return [
          {
            label: 'Expense',
            value: ExpenseGroupingFieldOption.EXPENSE_ID
          },
          {
            label: 'Expense Report',
            value: ExpenseGroupingFieldOption.CLAIM_NUMBER
          }
        ];
      }

      static getNameInJournalOptions(): SelectFormOption[] {
        return [
          {
            label: 'Merchant Name',
            value: NameInJournalEntry.MERCHANT
          },
          {
            label: 'Employee Name',
            value: NameInJournalEntry.EMPLOYEE
          }
        ];
      }

      static getReimbursableExpenseGroupingDateOptions(): SelectFormOption[] {
        return [
          {
            label: 'Current Date',
            value: ExportDateType.CURRENT_DATE
          },
          {
            label: 'Verification Date',
            value: ExportDateType.VERIFIED_AT
          },
          {
            label: 'Spend Date',
            value: ExportDateType.SPENT_AT
          },
          {
            label: 'Approval Date',
            value: ExportDateType.APPROVED_AT
          },
          {
            label: 'Last Spend Date',
            value: ExportDateType.LAST_SPENT_AT
          }
        ];
      }

      static getAdditionalCreditCardExpenseGroupingDateOptions(): SelectFormOption[] {
        return [
          {
            label: 'Card Transaction Post date',
            value: ExportDateType.POSTED_AT
          },
          {
            label: 'Spend Date',
            value: ExportDateType.SPENT_AT
          }
        ];
      }

      static getValidators(): [ExportSettingValidatorRule, ExportModuleRule[]] {
        const exportSettingValidatorRule: ExportSettingValidatorRule = {
          reimbursableExpense: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'expenseState'],
          creditCardExpense: ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'cccExpenseState']
        };

        const exportModuleRule: ExportModuleRule[] = [
          {
            formController: 'reimbursableExportType',
            requiredValue: {
              [NetsuiteReimbursableExpensesObject.BILL]: ['accountsPayable']
            }
          },
          {
            formController: 'creditCardExportType',
            requiredValue: {
              [NetSuiteCorporateCreditCardExpensesObject.BILL]: ['defaultCreditCardVendor', 'accountsPayable']
            }
          }
        ];

        return [exportSettingValidatorRule, exportModuleRule];
      }

      static mapAPIResponseToFormGroup(exportSettings: NetSuiteExportSettingGet | null): FormGroup {
        return new FormGroup({
          expenseState: new FormControl(exportSettings?.expense_group_settings?.expense_state),
          employeeFieldMapping: new FormControl(exportSettings?.configuration?.employee_field_mapping),
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
          defaultCCCAccount: new FormControl(exportSettings?.general_mappings?.default_ccc_account?.id ? exportSettings.general_mappings.default_ccc_account : null),
          accountsPayable: new FormControl(exportSettings?.general_mappings?.accounts_payable?.id ? exportSettings.general_mappings.accounts_payable : null),
          defaultCreditCardVendor: new FormControl(exportSettings?.general_mappings?.default_ccc_vendor?.id ? exportSettings.general_mappings.default_ccc_vendor : null)
        });
      }

      static constructPayload(exportSettingsForm: FormGroup): NetSuiteExportSettingPost {
        const emptyDestinationAttribute: DefaultDestinationAttribute = {id: null, name: null};
        let nameInJournalEntry = NameInJournalEntry.EMPLOYEE;

        if (!brandingFeatureConfig.featureFlags.exportSettings.nameInJournalEntry) {
          nameInJournalEntry = NameInJournalEntry.MERCHANT;
        } else {
          nameInJournalEntry = exportSettingsForm.get('nameInJournalEntry')?.value;
        }

        const exportSettingPayload: NetSuiteExportSettingPost = {
          expense_group_settings: {
            expense_state: exportSettingsForm.get('expenseState')?.value,
            ccc_expense_state: exportSettingsForm.get('cccExpenseState')?.value,
            reimbursable_expense_group_fields: exportSettingsForm.get('reimbursableExportGroup')?.value ? [exportSettingsForm.get('reimbursableExportGroup')?.value] : null,
            reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value,
            corporate_credit_card_expense_group_fields: exportSettingsForm.get('creditCardExportGroup')?.value ? [exportSettingsForm.get('creditCardExportGroup')?.value] : null,
            ccc_export_date_type: exportSettingsForm.get('creditCardExportDate')?.value
          },
          configuration: {
            reimbursable_expenses_object: exportSettingsForm.get('reimbursableExportType')?.value,
            corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExportType')?.value,
            employee_field_mapping: exportSettingsForm.get('employeeFieldMapping')?.value,
            auto_map_employees: exportSettingsForm.get('autoMapEmployees')?.value,
            name_in_journal_entry: nameInJournalEntry
          },
          general_mappings: {
            reimbursable_account: exportSettingsForm.get('defaultCCCAccount')?.value ? exportSettingsForm.get('defaultCCCAccount')?.value : emptyDestinationAttribute,
            default_ccc_account: exportSettingsForm.get('accountsPayable')?.value ? exportSettingsForm.get('accountsPayable')?.value : emptyDestinationAttribute,
            accounts_payable: exportSettingsForm.get('defaultCreditCardVendor')?.value ? exportSettingsForm.get('defaultCreditCardVendor')?.value : emptyDestinationAttribute,
            default_ccc_vendor: exportSettingsForm.get('defaultDebitCardAccount')?.value ? exportSettingsForm.get('defaultDebitCardAccount')?.value : emptyDestinationAttribute
          }
        };

        return exportSettingPayload;
      }
}


