import { CorporateCreditCardExpensesObject, FyleField, ExpenseState, ExportDateType, IntacctReimbursableExpensesObject } from "../../enum/enum.model";

export type ExportSettingFormOption = {
    label: string,
    value: ExpenseState | IntacctReimbursableExpensesObject | CorporateCreditCardExpensesObject | ExportDateType | string | FyleField;
}

export type ExportSettingGet = {
    id: number,
    created_at: Date,
    updated_at: Date,
    is_simplify_report_closure_enabled: boolean,
    reimbursable_expenses_export_type: IntacctReimbursableExpensesObject | null,
    bank_account_name: string | null,
    expense_state: ExpenseState | null,
    reimbursable_expense_date: ExportDateType | null,
    reimbursable_expense_grouped_by: string[] | null,
    auto_map_employees: string,
    employeeFieldMapping: string | null,
    credit_card_expense_export_type: CorporateCreditCardExpensesObject | null,
    ccc_expense_state: ExpenseState | null,
    credit_card_entity_name_preference: FyleField | null,
    credit_card_account_name: string | null,
    credit_card_expense_grouped_by: string[] | null,
    credit_card_expense_date: ExportDateType | null,
    gl_accounts: string | null,
    workspace: number
}

export type ExportSettingPost = {
    reimbursable_expenses_export_type: IntacctReimbursableExpensesObject | null,
    bank_account_name: string | null,
    expense_state: ExpenseState | null,
    reimbursable_expense_date: ExportDateType | null,
    reimbursable_expense_grouped_by: string[] | null,
    auto_map_employees: string | null,
    credit_card_expense_export_type: CorporateCreditCardExpensesObject | null,
    ccc_xpense_state: ExpenseState | null,
    credit_card_entity_name_preference: FyleField | null,
    credit_card_account_name: string | null,
    credit_card_expense_grouped_by: string[] | null,
    credit_card_expense_date: ExportDateType | null,
}