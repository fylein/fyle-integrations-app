export type DestinationAttributeDetail = {
  email: string;
  customer_id: string;
  customer_name: string;
  gl_account_no: string;
  gl_account_title: string;
  is_reimbursable: boolean;
  country: string;
};

export type MappingDestination = {
  id?: number;
  attribute_type?: string;
  display_name?: string;
  value?: string;
  destination_id?: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
  detail?: DestinationAttributeDetail;
};
