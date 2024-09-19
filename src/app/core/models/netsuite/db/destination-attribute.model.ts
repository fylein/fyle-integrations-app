import type { DestinationAttribute } from "../../db/destination-attribute.model";

interface NetsuiteDestinationAttributeDetail {
  country?: string;
}

export interface NetsuiteDestinationAttribute extends DestinationAttribute {
  detail: NetsuiteDestinationAttributeDetail;
}
