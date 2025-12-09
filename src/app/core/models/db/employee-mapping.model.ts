import { DestinationAttribute } from './destination-attribute.model';
import { ExpenseAttribute } from './expense-attribute.model';
import { MappingPrimaryKey } from './mapping.model';

export type EmployeeMappingPost = {
  source_employee: MappingPrimaryKey;
  destination_employee: MappingPrimaryKey;
  destination_vendor: MappingPrimaryKey;
  destination_card_account: MappingPrimaryKey;
  workspace: number;
};

export type EmployeeMapping = {
  id: number;
  source_employee: ExpenseAttribute;
  destination_employee: DestinationAttribute;
  destination_vendor: DestinationAttribute;
  destination_card_account: DestinationAttribute;
  workspace: number;
};
