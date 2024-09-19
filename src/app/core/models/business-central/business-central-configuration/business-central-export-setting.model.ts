import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AutoMapEmployeeOptions, BusinessCentralExportType, CCCExpenseState, ExpenseGroupedBy, ExpenseState, ExportDateType, FyleField, NameInJEField } from "../../enum/enum.model";
import type { DestinationAttribute } from "../../db/destination-attribute.model";
import { brandingContent } from "src/app/branding/branding-config";
import type { SelectFormOption } from "../../common/select-form-option.model";

export interface BusinessCentralExportSetting {
    reimbursable_expenses_export_type: BusinessCentralExportType,
    reimbursable_expense_state: ExpenseState,
    reimbursable_expense_date: ExportDateType,
    reimbursable_expense_grouped_by: ExpenseGroupedBy,
    credit_card_expense_export_type: BusinessCentralExportType,
    credit_card_expense_state: CCCExpenseState,
    credit_card_expense_grouped_by: ExpenseGroupedBy,
    credit_card_expense_date: ExportDateType,
    default_bank_account_name: string,
    default_bank_account_id: string,
    name_in_journal_entry: string,
    employee_field_mapping: string,
    auto_map_employees: string,
    default_vendor_name: string,
    default_vendor_id: string
}

export interface BusinessCentralExportSettingGet extends BusinessCentralExportSetting {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace: number
}

export interface BusinessCentralExportSettingPost extends BusinessCentralExportSetting {}

export interface BusinessCentralExportSettingFormOption {
    label: string,
    value: ExpenseState | CCCExpenseState | FyleField | ExpenseGroupedBy | BusinessCentralExportType | ExportDateType | AutoMapEmployeeOptions | NameInJEField;
}

export class BusinessCentralExportSettingModel {

    static getExpenseGroupByOptions(): SelectFormOption[] {
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

    static getCCCExpenseGroupingDateOptions(): SelectFormOption[] {
      return [
        {
          label: 'Card Transaction Post date',
          value: ExportDateType.POSTED_AT
        },
        {
          label: brandingContent.common.currentDate,
          value: ExportDateType.CURRENT_DATE
        },
        {
          label: 'Last Spent Date',
          value: ExportDateType.LAST_SPENT_AT
        },
        {
          label: 'Spent Date',
          value: ExportDateType.SPENT_AT
        }
      ];
    }

    static getReimbursableExpenseGroupingDateOptions(): BusinessCentralExportSettingFormOption[] {
      return [
        {
          label: brandingContent.common.currentDate,
          value: ExportDateType.CURRENT_DATE
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
            label: 'Purchase Invoice',
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

    static getCCCExpenseState(): BusinessCentralExportSettingFormOption[] {
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

    static getReimbursableExpenseState(): BusinessCentralExportSettingFormOption[] {
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

    static getNameInJEOptions(): BusinessCentralExportSettingFormOption[] {
      return [
          {
            label: 'Employee',
            value: FyleField.EMPLOYEE
          },
          {
            label: 'Merchant',
            value: NameInJEField.MERCHANT
          }
      ];
  }

    static getEmployeeMappingOptions(): BusinessCentralExportSettingFormOption[] {
        return [
            { label: 'Based on Employee E-mail ID', value: AutoMapEmployeeOptions.EMAIL },
            { label: 'Based on Employee Name', value: AutoMapEmployeeOptions.NAME }
        ];
    }

    static mapAPIResponseToFormGroup(exportSettings: BusinessCentralExportSettingGet | null,  accounts: DestinationAttribute[], vendors: DestinationAttribute[]): FormGroup {
      const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
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
            defaultBankName: new FormControl(exportSettings?.default_bank_account_name ? findObjectByDestinationId(accounts, exportSettings?.default_bank_account_id) : null),
            reimbursableEmployeeMapping: new FormControl(exportSettings?.employee_field_mapping ? exportSettings?.employee_field_mapping : null, Validators.required),
            journalEntryNamePreference: new FormControl(exportSettings?.name_in_journal_entry ? exportSettings?.name_in_journal_entry : null),
            autoMapEmployee: new FormControl(exportSettings?.auto_map_employees ? exportSettings?.auto_map_employees : null),
            defaultVendorName: new FormControl(exportSettings?.default_vendor_name ? findObjectByDestinationId(vendors, exportSettings?.default_vendor_id) : null),
            searchOption: new FormControl('')
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
            default_bank_account_name: exportSettingsForm.get('defaultBankName')?.value ? exportSettingsForm.get('defaultBankName')?.value.value : null,
            default_bank_account_id: exportSettingsForm.get('defaultBankName')?.value ? exportSettingsForm.get('defaultBankName')?.value.destination_id : null,
            name_in_journal_entry: exportSettingsForm.get('journalEntryNamePreference')?.value ? exportSettingsForm.get('journalEntryNamePreference')?.value : null,
            employee_field_mapping: exportSettingsForm.get('reimbursableEmployeeMapping')?.value ? exportSettingsForm.get('reimbursableEmployeeMapping')?.value : null,
            auto_map_employees: exportSettingsForm.get('autoMapEmployee')?.value ? exportSettingsForm.get('autoMapEmployee')?.value : null,
            default_vendor_id: exportSettingsForm.get('defaultVendorName')?.value ? exportSettingsForm.get('defaultVendorName')?.value.destination_id : null,
            default_vendor_name: exportSettingsForm.get('defaultVendorName')?.value ? exportSettingsForm.get('defaultVendorName')?.value.value : null
        };
    }
  }
