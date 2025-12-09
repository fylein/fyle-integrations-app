import { DestinationAttribute, GroupedDestinationAttribute } from '../../db/destination-attribute.model';

type EmployeeMappingDetail = {
  email: string | null;
};

type TaxMappingDetails = {
  customer_id: string | null;
  customer_name: string | null;
};

export interface BusinessCentralDestinationAttributes extends DestinationAttribute {
  auto_created: boolean;
  detail: EmployeeMappingDetail | TaxMappingDetails | null;
}
