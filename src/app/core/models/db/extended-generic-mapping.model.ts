import type { CategoryMapping } from "./category-mapping.model";
import type { EmployeeMapping } from "./employee-mapping.model";
import type { ExpenseAttribute } from "./expense-attribute.model";
import type { GenericMapping } from "./generic-mapping.model";
import type { PaginatedResponse } from "./paginated-response.model";

  export interface ExtendedGenericMapping extends ExpenseAttribute {
    mapping?: GenericMapping[];
    employeemapping?: EmployeeMapping[];
    categorymapping?: CategoryMapping[];
  }

  export interface GenericMappingResponse extends PaginatedResponse {
    results: ExtendedGenericMapping[];
  }