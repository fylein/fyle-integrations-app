import { BusinessCentralDestinationAttributes } from '../business-central/db/business-central-destination-attribute.model';
import { QbdDirectDestinationAttribute } from '../qbd-direct/db/qbd-direct-destination-attribuite.model';
import { Sage300DestinationAttributes } from '../sage300/db/sage300-destination-attribuite.model';
import { PaginatedResponse } from './paginated-response.model';

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
  code?: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  detail: any;
};

export type DefaultDestinationAttribute = {
  id: string | null;
  name: string | null;
};

export interface PaginatedDestinationAttribute extends PaginatedResponse {
  results: DestinationAttribute[];
}

export type GroupedDestinationAttribute = {
  ACCOUNT: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[] | QbdDirectDestinationAttribute[];
  EXPENSE_TYPE: Sage300DestinationAttributes[];
  EXPENSE_PAYMENT_TYPE: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  VENDOR_PAYMENT_ACCOUNT: DestinationAttribute[];
  VENDOR: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  CHARGE_CARD_NUMBER: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  TAX_DETAIL: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  LOCATION: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  DEPARTMENT: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  PROJECT: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  CLASS: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  ITEM: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  PAYMENT_ACCOUNT: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  EMPLOYEE: Sage300DestinationAttributes[] | BusinessCentralDestinationAttributes[];
  JOB: Sage300DestinationAttributes[];
  BANK_ACCOUNT: DestinationAttribute[];
  CREDIT_CARD_ACCOUNT: DestinationAttribute[];
  ACCOUNTS_PAYABLE: DestinationAttribute[];
  TAX_CODE: DestinationAttribute[];
  COMPANY: BusinessCentralDestinationAttributes[];
};

export type DestinationAttributeStats = {
  attributes_count: number;
  active_attributes_count: number;
  inactive_attributes_count: number;
};
