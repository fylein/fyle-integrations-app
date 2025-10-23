import { environment } from "src/environments/environment";

export { Expense } from '../../db/expense.model';

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
    const url = `${environment.fyle_app_url}/app/admin/#/company_expenses?txnId=${expense_id}`;
    return url;
  }
}