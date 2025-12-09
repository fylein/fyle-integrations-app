import { DestinationAttribute } from '../../db/destination-attribute.model';

type IntacctDestinationAttributeDetail = {
  email?: string;
  customer_id?: string;
  customer_name?: string;
  gl_account_no?: string;
  gl_account_title?: string;
  is_reimbursable?: boolean;
  country?: string;
};

export interface IntacctDestinationAttribute extends DestinationAttribute {
  detail: IntacctDestinationAttributeDetail;
}

export type PaginatedintacctDestinationAttribute = {
  count: number;
  next: string;
  previous: string;
  results: IntacctDestinationAttribute[];
};

export type ExportSettingDestinationAttributeOption = {
  VENDOR: IntacctDestinationAttribute[];
  ACCOUNT: IntacctDestinationAttribute[];
  EXPENSE_PAYMENT_TYPE: IntacctDestinationAttribute[];
  CCC_EXPENSE_PAYMENT_TYPE: IntacctDestinationAttribute[];
  CHARGE_CARD: IntacctDestinationAttribute[];
};

export type GroupedDestinationAttribute = {
  ACCOUNT: IntacctDestinationAttribute[];
  EXPENSE_TYPE: IntacctDestinationAttribute[];
  EXPENSE_PAYMENT_TYPE: IntacctDestinationAttribute[];
  VENDOR: IntacctDestinationAttribute[];
  CHARGE_CARD_NUMBER: IntacctDestinationAttribute[];
  TAX_DETAIL: IntacctDestinationAttribute[];
  LOCATION: IntacctDestinationAttribute[];
  DEPARTMENT: IntacctDestinationAttribute[];
  PROJECT: IntacctDestinationAttribute[];
  CLASS: IntacctDestinationAttribute[];
  ITEM: IntacctDestinationAttribute[];
  PAYMENT_ACCOUNT: IntacctDestinationAttribute[];
  EMPLOYEE: IntacctDestinationAttribute[];
};
