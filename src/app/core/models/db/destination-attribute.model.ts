import { Sage300DestinationAttributes } from "../sage300/db/sage300-destination-attribuite.model";
export type DefaultDestinationAttribute = {
  id: string,
  name: string,
};

export type DestinationAttributeDetail = {
  email: string;
  customer_id: string;
  customer_name: string;
  gl_account_no: string;
  gl_account_title: string;
  is_reimbursable: boolean;
  country: string;
};

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

};

export type DefaultDestinationAttribute = {
  id: string,
  name: string,
};

export type GroupedDestinationAttribute = {
  ACCOUNT: Sage300DestinationAttributes[],
  EXPENSE_TYPE: Sage300DestinationAttributes[],
  EXPENSE_PAYMENT_TYPE: Sage300DestinationAttributes[],
  VENDOR: Sage300DestinationAttributes[],
  CHARGE_CARD_NUMBER: Sage300DestinationAttributes[],
  TAX_DETAIL: Sage300DestinationAttributes[],
  LOCATION: Sage300DestinationAttributes[],
  DEPARTMENT: Sage300DestinationAttributes[],
  PROJECT: Sage300DestinationAttributes[],
  CLASS: Sage300DestinationAttributes[],
  ITEM: Sage300DestinationAttributes[],
  PAYMENT_ACCOUNT: Sage300DestinationAttributes[],
  EMPLOYEE: Sage300DestinationAttributes[]
};