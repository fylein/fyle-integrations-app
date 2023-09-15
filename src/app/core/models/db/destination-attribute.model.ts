import { IntacctDestinationAttributeDetail } from "../si/db/destination-attribute.model";

export type DestinationAttribute = {
  id: number;
  attribute_type: string;
  display_name: string;
  value: string;
  destination_id: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  detail: IntacctDestinationAttributeDetail;
};

export type DefaultDestinationAttribute = {
  id: string,
  name: string,
};

export type GroupedDestinationAttribute = {
  ACCOUNT: DestinationAttribute[],
  EXPENSE_PAYMENT_TYPE: DestinationAttribute[],
  VENDOR: DestinationAttribute[],
  CHARGE_CARD_NUMBER: DestinationAttribute[],
  TAX_DETAIL: DestinationAttribute[],
  LOCATION: DestinationAttribute[],
  DEPARTMENT: DestinationAttribute[],
  PROJECT: DestinationAttribute[],
  CLASS: DestinationAttribute[],
  ITEM: DestinationAttribute[],
  PAYMENT_ACCOUNT: DestinationAttribute[],
  EMPLOYEE: DestinationAttribute[]
};