import { AccountingErrorType } from "../enum/enum.model";
import type { AccountingExport } from "./accounting-export.model";
import type { ExpenseAttribute } from "./expense-attribute.model";
import type { ExtendedGenericMapping } from "./extended-generic-mapping.model";
import type { PaginatedResponse } from "./paginated-response.model";

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
  article_link: string;
  is_resolved: boolean;
  error_title: string;
  error_detail: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}

export interface ErrorResponse extends PaginatedResponse {
  results: Error[];
}

export interface ErrorStat {
    resolvedCount: number;
    totalCount: number;
  }

export interface AccountingGroupedErrors {
    [AccountingErrorType.EMPLOYEE_MAPPING]: Error[];
    [AccountingErrorType.CATEGORY_MAPPING]: Error[];
    [AccountingErrorType.ACCOUNTING_ERROR]: Error[];
  }

export interface AccountingGroupedErrorStat {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null | ErrorStat;
    [AccountingErrorType.CATEGORY_MAPPING]: null | ErrorStat;
  }

export class ErrorModel {
  static formatErrors(errors: Error[]): AccountingGroupedErrors {
    return errors.reduce((groupedErrors: AccountingGroupedErrors, error: Error) => {
      let errorType;
      if (error.type === AccountingErrorType.EMPLOYEE_MAPPING || error.type === AccountingErrorType.CATEGORY_MAPPING) {
        errorType = error.type;
      } else {
        errorType = AccountingErrorType.ACCOUNTING_ERROR;
      }
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

  static getErroredMappings(errors: AccountingGroupedErrors, errorType: AccountingErrorType, isCategoryMappingGeneric?: boolean, isEmployeeMappingGeneric?: boolean): ExtendedGenericMapping[] {
    const filteredMappings: ExtendedGenericMapping[] = [];

    errors[errorType].forEach(element => {
      const filteredMapping: ExtendedGenericMapping = element.expense_attribute;
      if (errorType === AccountingErrorType.ACCOUNTING_ERROR || isCategoryMappingGeneric || isEmployeeMappingGeneric) {
        filteredMapping.mapping = [];
      } else if (errorType === AccountingErrorType.EMPLOYEE_MAPPING) {
        filteredMapping.employeemapping = [];
      } else if (errorType === AccountingErrorType.CATEGORY_MAPPING) {
        filteredMapping.categorymapping = [];
      }
      filteredMappings.push(filteredMapping);
    });

    return filteredMappings;
  }
}
