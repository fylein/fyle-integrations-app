import { PaginatedResponse } from "../../db/paginated-response.model";
import { FyleReferenceType } from "../../enum/enum.model";
import { ExpenseDetails } from "../../db/expense-details.model";
import { Expense } from "./expense.model";

export type ExpenseGroupDescription = {
  claim_number: string;
  employee_email: string;
  expense_id: string;
  report_id: string;
  settlement_id: string;
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

export type SkipExportList = ExpenseDetails;

export type SkipExportLog = Expense;

export interface SkipExportLogResponse extends PaginatedResponse {
  results: SkipExportLog[];
}

export type ExportableExpenseGroup = {
  exportable_expense_group_ids: number[];
};
