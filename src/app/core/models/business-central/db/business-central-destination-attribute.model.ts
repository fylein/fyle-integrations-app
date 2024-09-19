import type { DestinationAttribute } from "../../db/destination-attribute.model";
import { GroupedDestinationAttribute } from "../../db/destination-attribute.model";

interface EmployeeMappingDetail {
    email: string | null;
}

interface TaxMappingDetails {
    customer_id: string | null,
    customer_name: string | null
}

export interface BusinessCentralDestinationAttributes extends DestinationAttribute {
    auto_created: boolean;
    detail: EmployeeMappingDetail | TaxMappingDetails | null;
}
