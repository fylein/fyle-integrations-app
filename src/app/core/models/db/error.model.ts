import { AccountingErrorType } from "../enum/enum.model";
import { AccountingExport } from "./accounting-export.model";
import { ExpenseAttribute } from "./expense-attribute.model";

export interface DestinationAttributeDetail {
  user_id?: string;
  location?: string | null;
  full_name?: string;
  department?: string | null;
  department_id?: string | null;
  employee_code?: string | null;
  department_code?: string | null;
}

export interface Error {
    id: number;
    expense_attribute: ExpenseAttribute;
    expense_group: AccountingExport;
    type: AccountingErrorType;
    is_resolved: boolean;
    error_title: string;
    error_detail: string;
    created_at: Date;
    updated_at: Date;
    workspace: number;
  }

export type ErrorStat = {
    resolvedCount: number;
    totalCount: number;
  }

export type AccountingGroupedErrors = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: Error[];
    [AccountingErrorType.CATEGORY_MAPPING]: Error[];
    [AccountingErrorType.ACCOUNTING_ERROR]: Error[];
  }

export type AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null | ErrorStat;
    [AccountingErrorType.CATEGORY_MAPPING]: null | ErrorStat;
  }

export class ErrorModel {
  static formatErrors(errors: Error[]): AccountingGroupedErrors {
    return errors.reduce((groupedErrors: AccountingGroupedErrors, error: Error) => {
      const errorType = error.type === AccountingErrorType.EMPLOYEE_MAPPING || AccountingErrorType.CATEGORY_MAPPING ? error.type : AccountingErrorType.ACCOUNTING_ERROR;
      const group: Error[] = groupedErrors[errorType] || [];
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
