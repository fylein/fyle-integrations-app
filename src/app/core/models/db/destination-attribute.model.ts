import { BusinessCentralDestinationAttributes } from "../business-central/db/business-central-destination-attribute.model";
import { Sage300DestinationAttributes } from "../sage300/db/sage300-destination-attribuite.model";

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
  id: string | null,
  name: string | null,
};

export type GroupedDestinationAttribute = {
  ACCOUNT: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  EXPENSE_TYPE: Sage300DestinationAttributes[],
  EXPENSE_PAYMENT_TYPE: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  VENDOR: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  CHARGE_CARD_NUMBER: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  TAX_DETAIL: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  LOCATION: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  DEPARTMENT: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  PROJECT: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  CLASS: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  ITEM: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  PAYMENT_ACCOUNT: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  EMPLOYEE: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[],
  JOB: Sage300DestinationAttributes[],
  BANK_ACCOUNT: DestinationAttribute[],
  CREDIT_CARD_ACCOUNT: DestinationAttribute[],
  ACCOUNTS_PAYABLE: DestinationAttribute[],
  TAX_CODE: DestinationAttribute[],
};