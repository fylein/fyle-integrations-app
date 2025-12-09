import { CategoryMapping } from './category-mapping.model';
import { EmployeeMapping } from './employee-mapping.model';
import { ExpenseAttributeDetail } from './expense-attribute-detail.model';
import { MappingIntacct } from './mapping.model';

export type GenericMappingV2 = {
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

export interface ExtendedGenericMappingV2 extends GenericMappingV2 {
  mapping?: MappingIntacct[];
  employeemapping?: EmployeeMapping[];
  categorymapping?: CategoryMapping[];
}

export type GenericMappingV2Response = {
  count: number;
  next: string;
  previous: string;
  results: ExtendedGenericMappingV2[];
};
