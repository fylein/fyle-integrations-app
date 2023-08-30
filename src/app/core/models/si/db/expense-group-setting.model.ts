import { CCCExpenseState, ExpenseState, ExportDateType } from "../../enum/enum.model";


export type ExpenseGroupSettingPost = {
  expense_state: ExpenseState;
  ccc_expense_state: CCCExpenseState;
  reimbursable_expense_group_fields: string[] | null;
  reimbursable_export_date_type: ExportDateType | null;
  corporate_credit_card_expense_group_fields: string[] | null;
  ccc_export_date_type: ExportDateType | null;
};
