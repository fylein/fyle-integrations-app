import type { DestinationAttributeDetail } from "./error.model";

export interface ExpenseAttribute {
    id: number;
    attribute_type: string;
    display_name: string;
    value: string;
    source_id: string;
    auto_mapped: boolean;
    auto_created: boolean;
    active: boolean;
    detail: DestinationAttributeDetail | null;
    created_at: string;
    updated_at: string;
    workspace: number;
}

export interface ExpenseAttributeDetail {
  location: string;
  full_name: string;
  department_id: string;
  department: string;
  department_code: string;
  employee_code: string;
}