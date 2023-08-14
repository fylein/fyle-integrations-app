import { CorporateCreditCardExpensesObject, IntacctReimbursableExpensesObject } from "../enum/enum.model";

export type PreviewPage = {
  fyleExpense?: boolean,
  intacctReimburse?: IntacctReimbursableExpensesObject | null,
  intacctCCC?: CorporateCreditCardExpensesObject | null
};