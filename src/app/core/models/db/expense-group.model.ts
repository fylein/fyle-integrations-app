import { Expense } from "../si/db/expense.model";
import { PaginatedResponse } from "./paginated-response.model";

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

export interface ExpenseGroupResponse extends PaginatedResponse {
  results: ExpenseGroup[];
}

export type ExpenseGroupParam = {
  limit: number;
  offset: number;
  tasklog__status: string;
  exported_at__gte?: string;
  exported_at__lte?: string;
}

export type SkipExportParam = {
  limit: number;
  offset: number;
  org_id: string;
  start_date?: string;
  end_date?: string;
}
