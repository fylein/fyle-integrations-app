export type ImportDefaultField = {
  destination_field: string,
  source_field: string,
  formController: string,
  import_code?: string,
  is_auto_import_enabled?: boolean
  count?: number
}

export type ExpenseField = {
    attribute_type: string;
    display_name: string;
    source_placeholder: string | null;
    is_dependent: boolean;
  };

  export type ExpenseFieldFormArray = {
    source_field: string;
    destination_field: string;
    import_to_fyle: boolean;
    is_custom: boolean;
    source_placeholder: string;
};

export type ImportSettingMappingRow = {
  destination_field: string,
  import_to_fyle: boolean,
  is_custom: boolean,
  source_field: string,
  source_placeholder: string | null,
  import_code?: boolean,
  is_auto_import_enabled?: boolean
}

export type ImportSettingsCustomFieldRow = {
  attribute_type: string,
  display_name: string,
  source_placeholder: string | null,
  is_dependent: boolean
}

export type ImportCodeFieldConfigType = {
  [key: string]: boolean;
};