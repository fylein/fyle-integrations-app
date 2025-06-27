import { FormGroup, FormControl } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { BusinessCentralImportSettingsGet } from "../business-central/business-central-configuration/business-central-import-settings.model";
import { IntegrationField } from "../db/mapping.model";
import { Sage300ImportSettingGet } from "../sage300/sage300-configuration/sage300-import-settings.model";

export type ImportDefaultField = {
  destination_field: string,
  source_field: string,
  formController: string,
  import_code?: string
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
  import_code?: boolean
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