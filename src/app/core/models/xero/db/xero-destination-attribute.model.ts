import type { DestinationAttribute } from "../../db/destination-attribute.model";
import { GroupedDestinationAttribute } from "../../db/destination-attribute.model";

export interface DestinationAttributeDetail {
    email: string;
    fully_qualified_name: string;
}

export interface XeroDestinationAttributes extends DestinationAttribute {
    auto_created: boolean;
    detail: DestinationAttributeDetail | null;
}
