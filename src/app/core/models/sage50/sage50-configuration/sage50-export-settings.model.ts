import { DestinationAttribute } from '../../db/destination-attribute.model';
import { CCCExpenseState, ExpenseState } from '../../enum/enum.model';
import { FormControl } from '@angular/forms';

export enum Sage50ReimbursableExportType {
  GENERAL_JOURNAL_ENTRY = 'GENERAL_JOURNAL_ENTRY',
  PURCHASES_RECEIVE_INVENTORY = 'PURCHASES_RECEIVE_INVENTORY',
}

export enum Sage50ReimbursableExpenseDate {
  SPENT_AT = 'spent_at',
  CURRENT_DATE = 'current_date',
}

export enum Sage50CCCExportType {
  PAYMENTS_JOURNAL = 'PAYMENTS_JOURNAL',
  GENERAL_JOURNAL_ENTRY = 'GENERAL_JOURNAL_ENTRY',
  PURCHASES_RECEIVE_INVENTORY = 'PURCHASES_RECEIVE_INVENTORY',
}

export enum Sage50CCCExpensesDate {
  SPENT_AT = 'spent_at',
  POSTED_AT = 'posted_at',
  CURRENT_DATE = 'current_date',
}

// Common for both reimbursable and CCC expense
export enum Sage50ExpensesGroupedBy {
  REPORT = 'report_id',
  EXPENSE = 'expense_id',
}

type Sage50ExportSettingsBase = {
  reimbursable_expense_export_type: Sage50ReimbursableExportType | null;
  reimbursable_expense_state: ExpenseState | null;
  reimbursable_expense_date: Sage50ReimbursableExpenseDate | null;
  reimbursable_expense_grouped_by: Sage50ExpensesGroupedBy | null;
  default_payment_method: string | null;
  credit_card_expense_export_type: Sage50CCCExportType | null;
  credit_card_expense_state: CCCExpenseState | null;
  credit_card_expense_date: Sage50CCCExpensesDate | null;
  credit_card_expense_grouped_by: Sage50ExpensesGroupedBy | null;
};

export interface Sage50ExportSettingsPost extends Sage50ExportSettingsBase {
  reimbursable_default_credit_line_account: number | null;
  reimbursable_default_account_payable_account: number | null;
  default_per_diem_account: number | null;
  default_mileage_account: number | null;
  ccc_default_credit_line_account: number | null;
  ccc_default_account_payable_account: number | null;
  default_cash_account: number | null;
  default_vendor: number | null;
}

export interface Sage50ExportSettingsGet extends Sage50ExportSettingsBase {
  reimbursable_default_credit_line_account: DestinationAttribute | null;
  reimbursable_default_account_payable_account: DestinationAttribute | null;
  default_per_diem_account: DestinationAttribute | null;
  default_mileage_account: DestinationAttribute | null;
  ccc_default_credit_line_account: DestinationAttribute | null;
  ccc_default_account_payable_account: DestinationAttribute | null;
  default_cash_account: DestinationAttribute | null;
  default_vendor: DestinationAttribute | null;
}

export type Sage50ExportSettingsForm = {
  reimbursableExpenses: FormControl<boolean>;
  reimbursableExportType: FormControl<Sage50ReimbursableExportType | null>;
  reimbursableExpenseState: FormControl<ExpenseState | null>;
  reimbursableExportDate: FormControl<Sage50ReimbursableExpenseDate | null>;
  reimbursableExportGroup: FormControl<Sage50ExpensesGroupedBy | null>;
  cccExpenses: FormControl<boolean>;
  cccExportType: FormControl<Sage50CCCExportType | null>;
  cccExpenseState: FormControl<CCCExpenseState | null>;
  cccExportDate: FormControl<Sage50CCCExpensesDate | null>;
  cccExportGroup: FormControl<Sage50ExpensesGroupedBy | null>;
  reimbursableDefaultCreditLineAccount: FormControl<DestinationAttribute | null>;
  reimbursableDefaultAccountPayableAccount: FormControl<DestinationAttribute | null>;
  defaultPerDiemAccount: FormControl<DestinationAttribute | null>;
  defaultMileageAccount: FormControl<DestinationAttribute | null>;
  cccDefaultCreditLineAccount: FormControl<DestinationAttribute | null>;
  cccDefaultAccountPayableAccount: FormControl<DestinationAttribute | null>;
  defaultCashAccount: FormControl<DestinationAttribute | null>;
  defaultVendor: FormControl<DestinationAttribute | null>;
  defaultPaymentMethod: FormControl<string | null>;
};
