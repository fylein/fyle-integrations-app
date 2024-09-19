import type { CategoryMapping } from './category-mapping.model';
import type { EmployeeMapping } from './employee-mapping.model';
import type { ExpenseAttributeDetail } from './expense-attribute-detail.model';
import type { MappingIntacct } from './mapping.model';

export interface GenericMappingV2 {
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
}

export interface ExtendedGenericMappingV2 extends GenericMappingV2 {
  mapping?: MappingIntacct[];
  employeemapping?: EmployeeMapping[];
  categorymapping?: CategoryMapping[];
}

export interface GenericMappingV2Response {
  count: number;
  next: string;
  previous: string;
  results: ExtendedGenericMappingV2[];
}