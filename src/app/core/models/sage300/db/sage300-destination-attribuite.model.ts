import { DestinationAttribute } from "../../db/destination-attribute.model";

export type EmployeeMappingDetail = {
    email: string | null;
}

export interface Sage300DestinationAttributes extends DestinationAttribute {
    auto_created: boolean;
    detail: EmployeeMappingDetail | null;
}