import { Expense } from "../intacct/db/expense.model";
import { PaginatedResponse } from "./paginated-response.model";

export type ExpenseGroupDescription = {
  claim_number: string;
  employee_email: string;
  expense_id: string;
  report_id: string;
  settlement_id: string;
};

export type ExpenseGroup = {
  type: Date;
  export_url: string;
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

export interface ExpenseGroupResponse extends PaginatedResponse {
  results: ExpenseGroup[];
}

export type ExpenseGroupParam = {
  limit: number;
  offset: number;
  tasklog__status?: string;
  status__in?: string;
  exported_at__gte?: string;
  exported_at__lte?: string;
  state?: string;
  exported_at?: string;
  start_date?: string;
  end_date?: string;
  expenses__expense_number?: string;
  expenses__employee_name?: string;
  expenses__employee_email?: string;
  expenses__claim_number?: string;
}

export type SkipExportParam = {
  limit: number;
  offset: number;
  org_id: string;
  is_skipped: boolean;
  updated_at__gte?: string;
  updated_at__lte?: string;
  expense_number?: string;
  employee_name?: string;
  employee_email?: string;
  claim_number?: string;
}
