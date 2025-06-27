import { CCCExpenseState, EmployeeFieldMapping, ExpenseState, NameInJournalEntry, QBDCorporateCreditCardExpensesObject, QbdDirectCCCExportDateType, QbdDirectExpenseGroupBy, QbdDirectReimbursableExpensesObject, QbdDirectReimbursableExportDateType, QBDReimbursableExpensesObject } from "../../enum/enum.model";

export type QbdDirectExportSettingsPost = {
    reimbursable_expense_export_type: QBDReimbursableExpensesObject | null,
    reimbursable_expense_state: ExpenseState | null,
    reimbursable_expense_date: QbdDirectReimbursableExportDateType | null,
    reimbursable_expense_grouped_by: QbdDirectExpenseGroupBy | null,
    credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject | null,
    credit_card_expense_state: CCCExpenseState | null,
    credit_card_expense_grouped_by: QbdDirectExpenseGroupBy | null,
    credit_card_expense_date: QbdDirectCCCExportDateType  | null,
    employee_field_mapping: EmployeeFieldMapping,
    name_in_journal_entry: NameInJournalEntry;
    default_credit_card_account_name: string;
    default_credit_card_account_id: string;
    default_reimbursable_accounts_payable_account_name: string;
    default_reimbursable_accounts_payable_account_id: string;
    default_ccc_accounts_payable_account_name: string;
    default_ccc_accounts_payable_account_id: string;
}

export interface QbdDirectExportSettingGet extends QbdDirectExportSettingsPost {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace: number;
}