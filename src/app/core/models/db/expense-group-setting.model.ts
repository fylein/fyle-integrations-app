import { CCCExpenseState, ExpenseState, ExportDateType, SplitExpenseGrouping } from "../enum/enum.model";

export type ExpenseGroupSettingPost = {
  expense_state: ExpenseState;
  ccc_expense_state: CCCExpenseState;
  reimbursable_expense_group_fields?: string[] | null;
  reimbursable_export_date_type: ExportDateType | null;
  corporate_credit_card_expense_group_fields?: string[] | null;
  ccc_export_date_type: ExportDateType | null;
  split_expense_grouping: SplitExpenseGrouping;
};

export interface ExpenseGroupSetting extends ExpenseGroupSettingPost {
  id: number;
  reimbursable_expense_group_fields: string[];
  reimbursable_export_date_type: ExportDateType;
  corporate_credit_card_expense_group_fields: string[];
  ccc_export_date_type: ExportDateType;
  import_card_credits: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}

export interface ExpenseGroupSettingGet extends ExpenseGroupSettingPost {}
