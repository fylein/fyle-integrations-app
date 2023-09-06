import { FyleReferenceType } from "../../enum/enum.model";
import { Expense } from "./expense.model";

export type ExpenseGroupDescription = {
  [FyleReferenceType.EXPENSE_REPORT]: string;
  [FyleReferenceType.REPORT_ID]: string;
  employee_email: string;
  [FyleReferenceType.EXPENSE]: string;
  [FyleReferenceType.PAYMENT]: string;
};

export type ExpenseGroup = {
  id: number;
  fund_source: string;
  description: ExpenseGroupDescription;
  // Having any here is okay, different intacct exports has different structures
  response_logs: any;
  export_type: string;
  employee_name: string;
  exported_at: Date;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  expenses: Expense[];
};

export type ExpenseGroupResponse = {
  count: number;
  next: string;
  previous: string;
  results: ExpenseGroup[];
};

export interface SkipExportList {
  updated_at: Date;
  employee: [string, string];
  expenseType: 'Credit Card' | 'Reimbursable';
  claim_number: string;
}

export type SkipExportLog = {
  employee_name: string;
  employee_email: string;
  claim_number: string;
  updated_at: Date;
  fund_source: string;
};

export type SkipExportLogResponse = {
  count: number;
  next: string;
  previous: string;
  results: SkipExportLog[];
};

export type ExportableExpenseGroup = {
  exportable_expense_group_ids: number[];
};
