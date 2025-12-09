import {
  AutoMapEmployeeOptions,
  BusinessCentralExportType,
  CCCExpenseState,
  ExpenseGroupedBy,
  ExpenseState,
  ExportDateType,
  FyleField,
  NameInJEField,
} from '../../enum/enum.model';

export type BusinessCentralExportSetting = {
  reimbursable_expenses_export_type: BusinessCentralExportType;
  reimbursable_expense_state: ExpenseState;
  reimbursable_expense_date: ExportDateType;
  reimbursable_expense_grouped_by: ExpenseGroupedBy;
  credit_card_expense_export_type: BusinessCentralExportType;
  credit_card_expense_state: CCCExpenseState;
  credit_card_expense_grouped_by: ExpenseGroupedBy;
  credit_card_expense_date: ExportDateType;
  default_bank_account_name: string;
  default_bank_account_id: string;
  default_ccc_bank_account_name: string;
  default_ccc_bank_account_id: string;
  name_in_journal_entry: string;
  employee_field_mapping: string;
  auto_map_employees: string;
  default_vendor_name: string;
  default_vendor_id: string;
};

export interface BusinessCentralExportSettingGet extends BusinessCentralExportSetting {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}

export interface BusinessCentralExportSettingPost extends BusinessCentralExportSetting {}

export type BusinessCentralExportSettingFormOption = {
  label: string;
  value:
    | ExpenseState
    | CCCExpenseState
    | FyleField
    | ExpenseGroupedBy
    | BusinessCentralExportType
    | ExportDateType
    | AutoMapEmployeeOptions
    | NameInJEField;
};
