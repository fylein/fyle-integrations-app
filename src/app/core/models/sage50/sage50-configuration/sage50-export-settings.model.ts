import { CCCExpenseState, ExpenseState } from "../../enum/enum.model";
import { FormControl } from "@angular/forms";

export enum Sage50ReimbursableExportType {
    GENERAL_JOURNAL_ENTRY = 'GENERAL_JOURNAL_ENTRY',
    PURCHASES_RECEIVE_INVENTORY = 'PURCHASES_RECEIVE_INVENTORY'
}

export enum Sage50ReimbursableExpenseDate {
    SPENT_AT = 'spent_at',
    CURRENT_DATE = 'current_date'
}

export enum Sage50CCCExportType {
    PAYMENTS_JOURNAL = 'PAYMENTS_JOURNAL',
    GENERAL_JOURNAL_ENTRY = 'GENERAL_JOURNAL_ENTRY',
    PURCHASES_RECEIVE_INVENTORY = 'PURCHASES_RECEIVE_INVENTORY'
}

export enum Sage50CCCExpensesDate {
    SPENT_AT = 'spent_at',
    POSTED_AT = 'posted_at',
    CURRENT_DATE = 'current_date'
}

// Common for both reimbursable and CCC expense
export enum Sage50ExpensesGroupedBy {
    REPORT = 'report_id',
    EXPENSE = 'expense_id'
}


export type Sage50ExportSettings = {
    reimbursable_expense_export_type: Sage50ReimbursableExportType,
    reimbursable_expense_state: ExpenseState,
    reimbursable_expense_date: Sage50ReimbursableExpenseDate,
    reimbursable_expense_grouped_by: Sage50ExpensesGroupedBy,
    credit_card_expense_export_type: Sage50CCCExportType,
    credit_card_expense_state: CCCExpenseState,
    credit_card_expense_date: Sage50CCCExpensesDate,
    credit_card_expense_grouped_by: Sage50ExpensesGroupedBy,
    je_single_credit_line: boolean,
    reimbursable_default_credit_line_account: string,
    reimbursable_default_account_payable_account: string,
    ccc_default_credit_line_account: string,
    ccc_default_account_payable_account: string,
    default_cash_account: string,
    default_vendor: string,
    default_payment_method: string,
};

export type Sage50ExportSettingsForm = {
    reimbursableExpenses: FormControl<boolean>,
    reimbursableExportType: FormControl<Sage50ReimbursableExportType | null>,
    reimbursableExpenseState: FormControl<ExpenseState | null>,
    reimbursableExportDate: FormControl<Sage50ReimbursableExpenseDate | null>,
    reimbursableExportGroup: FormControl<Sage50ExpensesGroupedBy | null>,
    cccExpenses: FormControl<boolean>,
    cccExportType: FormControl<Sage50CCCExportType | null>,
    cccExpenseState: FormControl<CCCExpenseState | null>,
    cccExportDate: FormControl<Sage50CCCExpensesDate | null>,
    cccExportGroup: FormControl<Sage50ExpensesGroupedBy | null>,
    jeSingleCreditLine: FormControl<boolean | null>,
    reimbursableDefaultCreditLineAccount: FormControl<string | null>,
    reimbursableDefaultAccountPayableAccount: FormControl<string | null>,
    cccDefaultCreditLineAccount: FormControl<string | null>,
    cccDefaultAccountPayableAccount: FormControl<string | null>,
    defaultCashAccount: FormControl<string | null>,
    defaultVendor: FormControl<string | null>,
    defaultPaymentMethod: FormControl<string | null>,
}