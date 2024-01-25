import { AccountingErrorType, CCCExpenseState, CCCImportState, DefaultImportFields, ExpenseState, ExportErrorSourceType, FyleField, ReimbursableImportState } from "../enum/enum.model";
import { AccountingGroupedErrors, Error } from "./error.model";

export class DashboardModel {
    static parseAPIResponseToGroupedError(errors: Error[]): AccountingGroupedErrors {
        return errors.reduce((groupedErrors: AccountingGroupedErrors, error: Error) => {
          const errorType = error.type === AccountingErrorType.EMPLOYEE_MAPPING || error.type === AccountingErrorType.CATEGORY_MAPPING ? error.type : AccountingErrorType.ACCOUNTING_ERROR;
          const group: Error[] = groupedErrors[errorType] || [];
          group.push(error);
          groupedErrors[errorType] = group;

          return groupedErrors;
        }, {
          [AccountingErrorType.EMPLOYEE_MAPPING]: [],
          [AccountingErrorType.CATEGORY_MAPPING]: [],
          [AccountingErrorType.ACCOUNTING_ERROR]: []
        });
    }

    static getReimbursableExpenseImportStateMap() {
      return {
        [ExpenseState.PAID]: ReimbursableImportState.PAID,
        [ExpenseState.PAYMENT_PROCESSING]: ReimbursableImportState.PROCESSING
      };
    }

    static getCCCExpenseImportStateMap() {
      return {
        [CCCExpenseState.PAID]: CCCImportState.PAID,
        [CCCExpenseState.APPROVED]: CCCImportState.APPROVED
      };
    }
}

export interface DestinationFieldMap {
  [ExportErrorSourceType.EMPLOYEE]: string;
  [ExportErrorSourceType.CATEGORY]: string;

}