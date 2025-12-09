import { CategoryMapping } from './category-mapping.model';
import { EmployeeMapping } from './employee-mapping.model';
import { ExpenseAttribute } from './expense-attribute.model';
import { GenericMapping } from './generic-mapping.model';
import { PaginatedResponse } from './paginated-response.model';

export interface ExtendedGenericMapping extends ExpenseAttribute {
  mapping?: GenericMapping[];
  employeemapping?: EmployeeMapping[];
  categorymapping?: CategoryMapping[];
}

export interface GenericMappingResponse extends PaginatedResponse {
  results: ExtendedGenericMapping[];
}
