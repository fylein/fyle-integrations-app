import { IntacctErrorType } from '../../enum/enum.model';
import { ExpenseGroup } from './expense-group.model';
import { ExpenseAttribute } from './expense-attribute.model';

export type Error = {
  id: number;
  type: IntacctErrorType;
  expense_group: ExpenseGroup;
  expense_attribute: ExpenseAttribute;
  is_resolved: boolean;
  error_title: string;
  error_detail: string;
  workspace_id: number;
  created_at: Date;
  updated_at: Date;
  article_link: string;
};

export type GroupedErrors = {
  [IntacctErrorType.EMPLOYEE_MAPPING]: Error[];
  [IntacctErrorType.CATEGORY_MAPPING]: Error[];
  [IntacctErrorType.INTACCT_ERROR]: Error[];
};

export type ErrorStat = {
  resolvedCount: number;
  totalCount: number;
};

export type GroupedErrorStat = {
  [IntacctErrorType.EMPLOYEE_MAPPING]: null | ErrorStat;
  [IntacctErrorType.CATEGORY_MAPPING]: null | ErrorStat;
};
