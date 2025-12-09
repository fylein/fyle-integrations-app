import { DestinationAttribute, GroupedDestinationAttribute } from '../../db/destination-attribute.model';

type EmployeeMappingDetail = {
  email: string | null;
};

type TaxMappingDetails = {
  customer_id: string | null;
  customer_name: string | null;
};

export interface Sage300DestinationAttributes extends DestinationAttribute {
  auto_created: boolean;
  detail: EmployeeMappingDetail | TaxMappingDetails | null;
}

export interface Sage300GroupedDestinationAttribute extends GroupedDestinationAttribute {
  ACCOUNT: Sage300DestinationAttributes[];
  EXPENSE_TYPE: Sage300DestinationAttributes[];
  EXPENSE_PAYMENT_TYPE: Sage300DestinationAttributes[];
  VENDOR: Sage300DestinationAttributes[];
  CHARGE_CARD_NUMBER: Sage300DestinationAttributes[];
  TAX_DETAIL: Sage300DestinationAttributes[];
  LOCATION: Sage300DestinationAttributes[];
  DEPARTMENT: Sage300DestinationAttributes[];
  PROJECT: Sage300DestinationAttributes[];
  CLASS: Sage300DestinationAttributes[];
  ITEM: Sage300DestinationAttributes[];
  PAYMENT_ACCOUNT: Sage300DestinationAttributes[];
  EMPLOYEE: Sage300DestinationAttributes[];
  JOB: Sage300DestinationAttributes[];
}
