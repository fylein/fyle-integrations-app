import type { IntacctCorporateCreditCardExpensesObject, IntacctReimbursableExpensesObject } from "../enum/enum.model";

export interface PreviewPage {
  fyleExpense?: boolean,
  intacctReimburse?: IntacctReimbursableExpensesObject | null,
  intacctCCC?: IntacctCorporateCreditCardExpensesObject | null
}