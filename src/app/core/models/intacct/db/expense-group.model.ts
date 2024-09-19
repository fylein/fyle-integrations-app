import type { PaginatedResponse } from "../../db/paginated-response.model";
import type { FyleReferenceType } from "../../enum/enum.model";
import type { Expense } from "./expense.model";

export interface ExpenseGroupDescription {
  claim_number: string;
  employee_email: string;
  expense_id: string;
  report_id: string;
  settlement_id: string;
}

export interface ExpenseGroup {
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
}

export interface ExpenseGroupResponse {
  count: number;
  next: string;
  previous: string;
  results: ExpenseGroup[];
}

export interface ExpenseGroupList {
  index?: number;
  exportedAt: Date;
  employee: [string, string];
  expenseType?: 'Corporate Card' | 'Reimbursable';
  referenceNumber: string;
  exportedAs: string;
  intacctUrl?: string;
  fyleUrl?: string;
  fyleReferenceType?: FyleReferenceType | null;
  expenses: Expense[];
}

export interface SkipExportList {
  updated_at: Date;
  employee: [string, string];
  expenseType: 'Corporate Card' | 'Reimbursable';
  claim_number: string;
  fyleUrl: string;
}

export interface SkipExportLog {
  employee_name: string;
  employee_email: string;
  claim_number: string;
  updated_at: Date;
  fund_source: string;
  expense_id: string;
  org_id: string;
}

export interface SkipExportLogResponse extends PaginatedResponse {
  results: SkipExportLog[];
}

export interface ExportableExpenseGroup {
  exportable_expense_group_ids: number[];
}
