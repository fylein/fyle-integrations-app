import { ExpenseAttributeDetail } from './expense-attribute-detail.model';
import { MappingDestination } from './mapping-destination.model';
import { MappingSource } from './mapping-source.model';

export type EmployeeMapping = {
  id: number;
  source_employee: MappingSource;
  destination_employee?: MappingDestination;
  destination_vendor?: MappingDestination;
  destination_card_account?: MappingDestination;
  workspace: number;
};

export type EmployeeMappingResult = {
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
};

export type EmployeeMappingsResponse = {
  count: number;
  next: string;
  previous: string;
  results: EmployeeMappingResult[];
};

export type EmployeeMappingPost = {
  source_employee: MappingSource;
  destination_employee?: MappingDestination | {id: null};
  destination_vendor?: MappingDestination | {id: null};
  destination_card_account?: MappingDestination | {id: null};
  workspace: number;
};