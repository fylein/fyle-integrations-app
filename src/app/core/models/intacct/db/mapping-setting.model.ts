import { MappingDestinationField, MappingSourceField, SageIntacctField } from '../../enum/enum.model';

export type MappingSetting = {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  source_field: MappingSourceField | string;
  destination_field: MappingDestinationField | string;
  import_to_fyle: boolean;
  is_custom: boolean;
  source_placeholder: string | null;
};

export type MappingSettingPost = {
  source_field: MappingSourceField | string;
  destination_field: MappingDestinationField | string;
  import_to_fyle: boolean;
  is_custom: boolean;
  source_placeholder: string | null;
};

export type MinimalMappingSetting = {
  source_field: MappingSourceField | string;
  destination_field: MappingDestinationField | SageIntacctField | string;
};

export type MappingSettingResponse = {
  count: number;
  next: string;
  previous: string;
  results: MappingSetting[];
};

export type MappingSettingList = {
  id?: number;
  intacctField: MappingDestinationField | string;
  fyleField: MappingSourceField | string;
  index: number;
  existingMapping: boolean;
  isDeleteButtonAllowed: boolean;
};
