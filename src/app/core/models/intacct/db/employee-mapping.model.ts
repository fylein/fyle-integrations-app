import type { IntacctDestinationAttribute } from './destination-attribute.model';
import type { ExpenseAttributeDetail } from './expense-attribute-detail.model';
import type { MappingDestination } from './mapping-destination.model';
import type { MappingSource } from './mapping-source.model';

export interface EmployeeMapping {
  id: number;
  source_employee: MappingSource;
  destination_employee: IntacctDestinationAttribute;
  destination_vendor: IntacctDestinationAttribute;
  destination_card_account?: IntacctDestinationAttribute;
  workspace: number;
  isOptionSearchInProgress?: boolean;
}

export interface EmployeeMappingResult {
  id: number;
  employeemapping: EmployeeMapping[];
  attribute_type?: string;
  display_name?: string;
  value?: string;
  source_id?: number;
  auto_mapped?: boolean;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
  detail?: ExpenseAttributeDetail;
}

export interface EmployeeMappingsResponse {
  count: number;
  next: string;
  previous: string;
  results: EmployeeMappingResult[];
}

export interface EmployeeMappingPost {
  source_employee: MappingSource;
  destination_employee?: MappingDestination | {id: null};
  destination_vendor?: MappingDestination | {id: null};
  destination_card_account?: MappingDestination | {id: null};
  workspace: number;
}

export interface DropdownOptionSearch {
  searchTerm: string,
  employeeMapping: EmployeeMapping,
}
