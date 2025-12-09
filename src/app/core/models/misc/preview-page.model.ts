import { IntacctCorporateCreditCardExpensesObject, IntacctReimbursableExpensesObject } from '../enum/enum.model';

export type PreviewPage = {
  fyleExpense?: boolean;
  intacctReimburse?: IntacctReimbursableExpensesObject | null;
  intacctCCC?: IntacctCorporateCreditCardExpensesObject | null;
};
