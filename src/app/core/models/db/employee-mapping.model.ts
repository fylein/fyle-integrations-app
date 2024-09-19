import type { DestinationAttribute } from "./destination-attribute.model";
import type { ExpenseAttribute } from "./expense-attribute.model";
import type { MappingPrimaryKey } from "./mapping.model";

export interface EmployeeMappingPost {
  source_employee: MappingPrimaryKey;
  destination_employee: MappingPrimaryKey;
  destination_vendor: MappingPrimaryKey;
  destination_card_account: MappingPrimaryKey;
  workspace: number;
}

export interface EmployeeMapping {
    id: number;
    source_employee: ExpenseAttribute;
    destination_employee: DestinationAttribute;
    destination_vendor: DestinationAttribute;
    destination_card_account: DestinationAttribute;
    workspace: number;
}