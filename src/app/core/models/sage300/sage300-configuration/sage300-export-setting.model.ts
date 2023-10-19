import { ExpenseState, CCCExpenseState, Sage300ExpenseDate, ExpenseGroupedBy, Sage300ExportTypes, FyleField, AutoMapEmployeeOptions } from "../../enum/enum.model";

export type Sage300ExportSettingFormOption = {
    label: string,
    value: ExpenseState | CCCExpenseState | Sage300ExportTypes | Sage300ExpenseDate | ExpenseGroupedBy | FyleField | AutoMapEmployeeOptions | null
}

export type sage300ExportSettingGet = {
    id?: number,
    reimbursable_expenses_export_type: Sage300ExportTypes,
    reimbursable_expense_state: ExpenseState,
    reimbursable_expense_date: Sage300ExpenseDate,
    reimbursable_expense_grouped_by: ExpenseGroupedBy
    credit_card_expense_export_type: Sage300ExportTypes,
    credit_card_expense_state:  CCCExpenseState,
    credit_card_expense_grouped_by: ExpenseGroupedBy
    credit_card_expense_date: Sage300ExpenseDate,
    default_ccc_account_name: string,
    default_ccc_account_id: number,
    default_vendor_name: string,
    default_vendor_id: number,
    created_at: Date,
    update_at: Date,
    workspace?: number
}

export type sage300ExportSettingPost = {
    reimbursable_expenses_export_type: Sage300ExportTypes,
    reimbursable_expense_state: ExpenseState,
    reimbursable_expense_date: Sage300ExpenseDate,
    reimbursable_expense_grouped_by: ExpenseGroupedBy
    credit_card_expense_export_type: Sage300ExportTypes,
    credit_card_expense_state:  CCCExpenseState,
    credit_card_expense_grouped_by: ExpenseGroupedBy
    credit_card_expense_date: Sage300ExpenseDate,
    default_ccc_account_name: string,
    default_ccc_account_id: number,
    default_vendor_name: string,
    default_vendor_id: number
}