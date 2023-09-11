import { FyleReferenceType } from "../../enum/enum.model";
import { Expense } from "./expense.model";

export type ExpenseGroupDescription = {
  claim_number: string;
  employee_email: string;
};

export type ExpenseGroup = {
  id: number;
  fund_source: string;
  description: ExpenseGroupDescription;
  response_logs: any;
  employee_name: string;
  created_at: Date;
  export_type: string;
  exported_at: Date;
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

export interface ExpenseGroupList {
  index: number;
  exportedAt: Date;
  employee: [string, string];
  expenseType: 'Corporate Card' | 'Reimbursable';
  referenceNumber: string;
  exportedAs: string;
  intacctUrl: string;
  fyleUrl: string;
  fyleReferenceType: FyleReferenceType | null;
  expenses: Expense[];
}

export interface SkipExportList {
  updated_at: Date;
  employee: [string, string];
  expenseType: 'Corporate Card' | 'Reimbursable';
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
