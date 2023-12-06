import { AccountingErrorType, DefaultImportFields, ExportErrorSourceType, FyleField } from "../enum/enum.model";
import { AccountingGroupedErrors, Error } from "./error.model";

export class DashboardModel {
    static parseAPIResponseToGroupedError(errors: Error[]): AccountingGroupedErrors {
        return errors.reduce((groupedErrors: AccountingGroupedErrors, error: Error) => {
          const group: Error[] = groupedErrors[error.type] || [];
          group.push(error);
          groupedErrors[error.type] = group;

          return groupedErrors;
        }, {
          [AccountingErrorType.EMPLOYEE_MAPPING]: [],
          [AccountingErrorType.CATEGORY_MAPPING]: [],
          [AccountingErrorType.ACCOUNTING_ERROR]: []
        });
      }
}

export interface DestinationFieldMap {
  [ExportErrorSourceType.EMPLOYEE]: string;
  [ExportErrorSourceType.CATEGORY]: string;

}