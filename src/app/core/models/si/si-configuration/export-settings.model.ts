import { CorporateCreditCardExpensesObject, Entity, ExpenseGroupedBy, ExpenseState, ExportDateType, ReimbursableExpensesObject } from "../../enum/enum.model";

export type ExportSettingFormOption = {
    label: string,
    value: ExpenseState | ReimbursableExpensesObject | CorporateCreditCardExpensesObject | ExportDateType | ExpenseGroupedBy | string | Entity;
}

export type ExportSettingGet = {
    id: number,
    created_at: Date,
    updated_at: Date,
    is_simplify_report_closure_enabled: boolean,
    reimbursable_expenses_export_type: ReimbursableExpensesObject | null,
    bank_account_name: string | null,
    reimbursable_expense_state: ExpenseState | null,
    reimbursable_expense_date: ExportDateType | null,
    reimbursable_expense_grouped_by: ExpenseGroupedBy | null,
    employeeFieldMapping: string | null,
    credit_card_expense_export_type: CorporateCreditCardExpensesObject | null,
    credit_card_expense_state: ExpenseState | null,
    credit_card_entity_name_preference: Entity | null,
    credit_card_account_name: string | null,
    credit_card_expense_grouped_by: ExpenseGroupedBy | null,
    credit_card_expense_date: ExportDateType | null,
    workspace: number
}

export type ExportSettingPost = {
    reimbursable_expenses_export_type: ReimbursableExpensesObject | null,
    bank_account_name: string | null,
    reimbursable_expense_state: ExpenseState | null,
    reimbursable_expense_date: ExportDateType | null,
    reimbursable_expense_grouped_by: ExpenseGroupedBy | null,
    credit_card_expense_export_type: CorporateCreditCardExpensesObject | null,
    credit_card_expense_state: ExpenseState | null,
    credit_card_entity_name_preference: Entity | null,
    credit_card_account_name: string | null,
    credit_card_expense_grouped_by: ExpenseGroupedBy | null,
    credit_card_expense_date: ExportDateType | null,
}