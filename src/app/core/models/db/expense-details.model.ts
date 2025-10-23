import { Expense } from "./expense.model";

export interface ExpenseDetails extends Expense {
    employee: [string, string];
    expenseType: 'Corporate Card' | 'Reimbursable';
    fyleUrl: string;
}