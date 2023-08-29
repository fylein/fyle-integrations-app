export type ExpenseField = {
    attribute_type: string;
    display_name: string;
    source_placeholder: string | null;
  };

  export type ExpenseFieldFormArray = {
    source_field: string;
    destination_field: string;
    import_to_fyle: boolean;
    is_custom: boolean;
    source_placeholder: string;
};