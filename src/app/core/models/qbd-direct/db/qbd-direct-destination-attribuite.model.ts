import { DestinationAttribute } from "../../db/destination-attribute.model";

type QbdDirectDestinationAttributeDetail = {
    account_type: string,
    account_number: number
}

  export interface QbdDirectDestinationAttribute extends DestinationAttribute {
    detail: QbdDirectDestinationAttributeDetail;
  }