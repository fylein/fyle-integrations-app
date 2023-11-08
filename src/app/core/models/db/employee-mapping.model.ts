import { DestinationAttribute } from "./destination-attribute.model";
import { ExpenseAttribute } from "./expense-attribute.model";



export type EmployeeMapping = {
    id: number;
    source_employee: ExpenseAttribute;
    destination_employee?: DestinationAttribute;
    destination_vendor?: DestinationAttribute;
    destination_card_account?: DestinationAttribute;
    workspace: number;
  };

  export interface EmployeeMappingResult extends ExpenseAttribute {
    employeemapping: EmployeeMapping;
  }