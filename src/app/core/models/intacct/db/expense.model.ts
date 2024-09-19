import { environment } from "src/environments/environment";

export interface Expense {
  id: number;
  employee_email: string;
  employee_name: string;
  category: string;
  sub_category: string;
  project: string;
  expense_id: string;
  org_id: string;
  expense_number: string;
  claim_number: string;
  amount: number;
  currency: string;
  foreign_amount: number;
  foreign_currency: string;
  tax_amount: number;
  tax_group_id: string;
  settlement_id: string;
  reimbursable: boolean;
  billable: boolean;
  state: string;
  vendor: string;
  cost_center: string;
  purpose: string;
  report_id: string;
  spent_at: Date;
  approved_at: Date;
  posted_at: Date;
  expense_created_at: Date;
  expense_updated_at: Date;
  created_at: Date;
  updated_at: Date;
  fund_source: string;
  verified_at: Date;
  custom_properties: any[];
  paid_on_sage_intacct: boolean;
  file_ids: string[];
  payment_number: string;
  corporate_card_id: string;
  is_skipped: boolean;
  report_title: string;
}

export interface ExpenseList {
  expenseID: string;
  amount?: [number, string];
  merchant?: string;
  category?: string;
  fyleUrl: string;
  expenseType?: 'Credit Card' | 'Reimbursable';
  name?: [string, string];
  fundSource?: string;
}

export class ExpenseModel {
  static constructViewExpenseUrl (expense_id: string) {
    const url = `${environment.fyle_app_url}/app/admin/#/view_expense/${expense_id}`;
    return url;
  }
}