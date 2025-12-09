import { MappingIntacct } from './mapping.model';

export type ExpenseAttributeDetail = {
  location: string;
  full_name: string;
  department_id: string;
  department: string;
  department_code: string;
  employee_code: string;
};

export type ExpenseAttribute = {
  id: number;
  attribute_type: string;
  display_name: string;
  value: string;
  source_id: number;
  auto_mapped: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  detail: ExpenseAttributeDetail;
};

export type MinimalExpenseAttribute = {
  id: number;
};

export interface ExtendedExpenseAttribute extends ExpenseAttribute {
  mapping: MappingIntacct[];
}

export type ExtendedExpenseAttributeResponse = {
  count: number;
  next: string;
  previous: string;
  results: ExtendedExpenseAttribute[];
};
