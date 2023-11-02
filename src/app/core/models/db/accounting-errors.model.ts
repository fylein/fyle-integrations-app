import { AccountingErrorType } from "../enum/enum.model";

export interface ExpenseAttribute {
    id: number;
    attribute_type: string; // Enum could be used if types are known and finite
    display_name: string;
    value: string;
    source_id: string;
    auto_mapped: boolean;
    auto_created: boolean;
    active: boolean;
    detail: Detail | null;
    created_at: string;
    updated_at: string;
    workspace: number;
  }

export interface AccountingError {
    id: number;
    expense_attribute: ExpenseAttribute;
    expense_group?: number | null;
    type: AccountingErrorType; // You might want to use an enum for known types
    is_resolved: boolean;
    error_title: string;
    error_detail: string;
    created_at: Date; // Consider using Date type if you're manipulating dates
    updated_at: Date;
    workspace: number;
  }

export type ErrorStat = {
    resolvedCount: number;
    totalCount: number;
  }

export type AccountingGroupedErrors = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: AccountingError[];
    [AccountingErrorType.CATEGORY_MAPPING]: AccountingError[];
  }

export type AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null | ErrorStat;
    [AccountingErrorType.CATEGORY_MAPPING]: null | ErrorStat;
  }

  export interface Detail {
    user_id?: string;
    location?: string | null;
    full_name?: string;
    department?: string | null;
    department_id?: string | null;
    employee_code?: string | null;
    department_code?: string | null;
  }
