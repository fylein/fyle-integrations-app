import { MappingState } from '../enum/enum.model';

export type MappingPrimaryKey = {
  id: number | null;
};

export type IntegrationField = {
  attribute_type: string;
  display_name: string;
};

export type FyleField = {
  attribute_type: string;
  display_name: string;
  is_dependent: boolean;
};

export type MappingStats = {
  all_attributes_count: number;
  unmapped_attributes_count: number;
};

export type GenericMappingApiParams = {
  limit: number;
  offset: number;
  mapped: boolean | MappingState;
  destination_type: string;
  mapping_source_alphabets?: string;
  source_type: string;
  value?: string;
  app_name?: string;
  employee_vendor_purchase_from?: boolean;
};
