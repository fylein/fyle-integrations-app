import { SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { AutoMapEmployeeOptions, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, SplitExpenseGrouping, XeroCCCExpenseState, XeroCorporateCreditCardExpensesObject, XeroReimbursableExpensesObject } from "../../enum/enum.model";

export type XeroExpenseGroupSettingPost = {
  ccc_expense_state: XeroCCCExpenseState;
  reimbursable_expense_group_fields?: string[] | null;
  reimbursable_export_date_type: ExportDateType | null;
  corporate_credit_card_expense_group_fields?: string[] | null;
  ccc_export_date_type: ExportDateType | null;
  reimbursable_expense_state: ExpenseState;
  split_expense_grouping: SplitExpenseGrouping
};

export interface XeroExpenseGroupSettingGet extends XeroExpenseGroupSettingPost {}

export type XeroExportSettingWorkspaceGeneralSettingPost = {
  reimbursable_expenses_object: XeroReimbursableExpensesObject | null,
  corporate_credit_card_expenses_object: XeroCorporateCreditCardExpensesObject | null,
  auto_map_employees: AutoMapEmployeeOptions | null,
}

export type XeroExportSettingGeneralMapping = {
  bank_account: DefaultDestinationAttribute
}

export type XeroExportSettingPost = {
  expense_group_settings: XeroExpenseGroupSettingPost,
  workspace_general_settings: XeroExportSettingWorkspaceGeneralSettingPost,
  general_mappings: XeroExportSettingGeneralMapping
}

export type XeroExportSettingGet = {
  expense_group_settings: XeroExpenseGroupSettingGet,
  workspace_general_settings: XeroExportSettingWorkspaceGeneralSettingPost,
  general_mappings: XeroExportSettingGeneralMapping,
  workspace_id: number
}

export interface XeroSelectFormOption extends SelectFormOption {
  value: ExpenseState | XeroCCCExpenseState | XeroReimbursableExpensesObject | XeroCorporateCreditCardExpensesObject | ExpenseGroupingFieldOption | ExportDateType | AutoMapEmployeeOptions | null;
}
