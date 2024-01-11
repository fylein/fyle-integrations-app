import { FormGroup, FormControl } from "@angular/forms";
import { AutoMapEmployeeOptions, BusinessCentralExportType, CCCExpenseState, ExpenseGroupedBy, ExpenseState, ExportDateType, FyleField } from "../../enum/enum.model";

export type BusinessCentralExportSetting = {
    reimbursable_expenses_export_type: BusinessCentralExportType,
    reimbursable_expense_state: ExpenseState,
    reimbursable_expense_date: ExportDateType,
    reimbursable_expense_grouped_by: ExpenseGroupedBy,
    credit_card_expense_export_type: BusinessCentralExportType,
    credit_card_expense_state: CCCExpenseState,
    credit_card_expense_grouped_by: ExpenseGroupedBy,
    credit_card_expense_date: ExportDateType,
    default_credit_card_account_name: string,
    default_credit_card_account_id: string,
    default_bank_account_name: string,
    default_bank_account_id: string,
    credit_card_entity_name_preference: string,
    employee_mapping: string
}

export interface BusinessCentralExportSettingGet extends BusinessCentralExportSetting {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace: number
}

export interface BusinessCentralExportSettingPost extends BusinessCentralExportSetting {}

export type BusinessCentralExportSettingFormOption = {
    label: string,
    value: ExpenseState | CCCExpenseState | FyleField | ExpenseGroupedBy | BusinessCentralExportType | ExportDateType | AutoMapEmployeeOptions;
}

export class BusinessCentralExportSettingModel {

    static getExpenseGroupByOptions(): BusinessCentralExportSettingFormOption[] {
        return [
          {
            label: 'Expense',
            value: ExpenseGroupedBy.EXPENSE
          },
          {
            label: 'Expense Report',
            value: ExpenseGroupedBy.REPORT
          }
        ];
    }

    static getCCCExpenseGroupingDateOptions(): BusinessCentralExportSettingFormOption[] {
      return [
        {
          label: 'Card Transaction Post date',
          value: ExportDateType.POSTED_AT
        },
        {
          label: 'Last Spent Date',
          value: ExportDateType.LAST_SPENT_AT
        },
        {
          label: 'Created At',
          value: ExportDateType.CREATED_AT
        }
      ];
    }

    static getReimbursableExpenseGroupingDateOptions(): BusinessCentralExportSettingFormOption[] {
      return [
        {
          label: 'Created At',
          value: ExportDateType.CREATED_AT
        },
        {
          label: 'Spent Date',
          value: ExportDateType.SPENT_AT
        },
        {
          label: 'Last Spent Date',
          value: ExportDateType.LAST_SPENT_AT
        }
      ];
    }

    static getReimbursableExpensesExportTypeOptions(): BusinessCentralExportSettingFormOption[] {
        return [
          {
            label: 'Accounts Payable Invoice',
            value: BusinessCentralExportType.PURCHASE_INVOICE
          },
          {
            label: 'Journal Entry',
            value: BusinessCentralExportType.JOURNAL_ENTRY
          }
        ];
    }

    static getCCCExpensesExportTypeOptions(): BusinessCentralExportSettingFormOption[] {
        return [
          {
            label: 'Journal Entry',
            value: BusinessCentralExportType.JOURNAL_ENTRY
          }
        ];
    }

    static getExpenseState(): BusinessCentralExportSettingFormOption[] {
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

    static getEntityOptions(): BusinessCentralExportSettingFormOption[] {
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

    static getEmployeeMappingOptions(): BusinessCentralExportSettingFormOption[] {
        return [
            { label: 'Based on Employee E-mail ID', value: AutoMapEmployeeOptions.EMAIL },
            { label: 'Based on Employee Name', value: AutoMapEmployeeOptions.NAME },
            { label: 'Based on Employee Code', value: AutoMapEmployeeOptions.EMPLOYEE_CODE }
        ];
    }

    static mapAPIResponseToFormGroup(exportSettings: BusinessCentralExportSettingGet | null): FormGroup {
        return new FormGroup({
            reimbursableExpense: new FormControl(exportSettings?.reimbursable_expenses_export_type ? true : false),
            reimbursableExportType: new FormControl(exportSettings?.reimbursable_expenses_export_type ? exportSettings.reimbursable_expenses_export_type : null),
            reimbursableExpenseState: new FormControl(exportSettings?.reimbursable_expense_state ? exportSettings?.reimbursable_expense_state : null),
            reimbursableExportDate: new FormControl(exportSettings?.reimbursable_expense_date ? exportSettings?.reimbursable_expense_date.toLowerCase() : null),
            reimbursableExportGroup: new FormControl(exportSettings?.reimbursable_expense_grouped_by ? exportSettings?.reimbursable_expense_grouped_by: null),
            creditCardExpense: new FormControl(exportSettings?.credit_card_expense_export_type ? true : false),
            cccExportType: new FormControl(exportSettings?.credit_card_expense_export_type ? exportSettings.credit_card_expense_export_type : null),
            cccExpenseState: new FormControl(exportSettings?.credit_card_expense_state ? exportSettings?.credit_card_expense_state : null),
            cccExportDate: new FormControl(exportSettings?.credit_card_expense_date ? exportSettings?.credit_card_expense_date.toLowerCase() : null),
            cccExportGroup: new FormControl(exportSettings?.credit_card_expense_grouped_by ? exportSettings?.credit_card_expense_grouped_by: null),
            defaultCreditCardCCCAccountName: new FormControl(exportSettings?.default_credit_card_account_name ? exportSettings?.default_credit_card_account_name : null),
            defaultBankName: new FormControl(exportSettings?.default_bank_account_name ? exportSettings?.default_bank_account_name : null),
            entityNamePreference: new FormControl(exportSettings?.credit_card_entity_name_preference ? exportSettings?.credit_card_entity_name_preference : null),
            reimbursableEmployeeMapping: new FormControl(exportSettings?.employee_mapping ? exportSettings?.employee_mapping : null)
        });
    }

    static createExportSettingPayload(exportSettingsForm: FormGroup): BusinessCentralExportSettingPost {
        return {
            reimbursable_expenses_export_type: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('reimbursableExportType')?.value : null,
            reimbursable_expense_state: exportSettingsForm.get('reimbursableExpenseState')?.value ? exportSettingsForm.get('reimbursableExpenseState')?.value : null,
            reimbursable_expense_date: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value.toUpperCase() : null,
            reimbursable_expense_grouped_by: exportSettingsForm.get('reimbursableExportGroup')?.value ? exportSettingsForm.get('reimbursableExportGroup')?.value : null,
            credit_card_expense_export_type: exportSettingsForm.get('cccExportType')?.value ? exportSettingsForm.get('cccExportType')?.value : null,
            credit_card_expense_state: exportSettingsForm.get('cccExpenseState')?.value ? exportSettingsForm.get('cccExpenseState')?.value : null,
            credit_card_expense_grouped_by: exportSettingsForm.get('cccExportGroup')?.value ? exportSettingsForm.get('cccExportGroup')?.value : null,
            credit_card_expense_date: exportSettingsForm.get('cccExportDate')?.value ? exportSettingsForm.get('cccExportDate')?.value.toUpperCase() : null,
            default_credit_card_account_name: exportSettingsForm.get('defaultCreditCardCCCAccountName')?.value ? exportSettingsForm.get('defaultCreditCardCCCAccountName')?.value.value : null,
            default_credit_card_account_id: exportSettingsForm.get('defaultCreditCardCCCAccountName')?.value ? exportSettingsForm.get('defaultCreditCardCCCAccountName')?.value.destination_id : null,
            default_bank_account_name: exportSettingsForm.get('defaultBankName')?.value ? exportSettingsForm.get('defaultBankName')?.value.value : null,
            default_bank_account_id: exportSettingsForm.get('defaultBankName')?.value ? exportSettingsForm.get('defaultBankName')?.value.destination_id : null,
            credit_card_entity_name_preference: exportSettingsForm.get('entityNamePreference')?.value ? exportSettingsForm.get('entityNamePreference')?.value : null,
            employee_mapping: exportSettingsForm.get('reimbursableEmployeeMapping')?.value ? exportSettingsForm.get('reimbursableEmployeeMapping')?.value : null
        };
    }
  }
