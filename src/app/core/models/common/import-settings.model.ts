import { FormGroup, FormControl } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { BusinessCentralImportSettingsGet } from "../business-central/business-central-configuration/business-central-import-settings.model";
import { IntegrationField } from "../db/mapping.model";
import { Sage300ImportSettingGet } from "../sage300/sage300-configuration/sage300-import-settings.model";

export type ImportDefaultField = {
  destination_field: string,
  source_field: string,
  formController: string
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
  source_placeholder: string | null
}

export type ImportSettingsCustomFieldRow = {
  attribute_type: string,
  display_name: string,
  source_placeholder: string | null,
  is_dependent: boolean
}

export class ImportSettingsModel {

  static getCustomFieldOption(): ExpenseField[] {
    return [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null, is_dependent: false }];
  }

  static createFormGroup(data: ImportSettingMappingRow): FormGroup {
    return new FormGroup ({
      source_field: new FormControl(data.source_field || '', RxwebValidators.unique()),
      destination_field: new FormControl(data.destination_field || '', RxwebValidators.unique()),
      import_to_fyle: new FormControl(data.import_to_fyle || false),
      is_custom: new FormControl(data.is_custom || false),
      source_placeholder: new FormControl(data.source_placeholder || null)
    });
  }

  static constructFormArray(importSettingsMappingSettings: ImportSettingMappingRow[] | [], accountingAppFields: IntegrationField[]): FormGroup[] {
    const expenseFieldFormArray: FormGroup[] = [];
    const mappedFieldMap = new Map<string, any>();
    const unmappedFieldMap = new Map<string, any>();

    // First loop to populate mappedFieldMap
    accountingAppFields.forEach((accountingAppField) => {
      const mappingSetting = importSettingsMappingSettings.find(
        (setting) => setting.destination_field === accountingAppField.attribute_type
      );

      const fieldData = mappingSetting || {
          destination_field: accountingAppField.attribute_type,
          import_to_fyle: false,
          is_custom: false,
          source_field: '',
          source_placeholder: null
      };
      if (mappingSetting) {
        mappedFieldMap.set(accountingAppField.attribute_type, fieldData);
      } else {
          unmappedFieldMap.set(accountingAppField.attribute_type, fieldData);
      }
    });

    // Handle only mapped fields
    accountingAppFields.forEach((accountingAppField) => {
      const fieldData = mappedFieldMap.get(accountingAppField.attribute_type);
      if (fieldData) {
        expenseFieldFormArray.push(this.createFormGroup(fieldData));
      }
    });

    if (mappedFieldMap.size === 0){
      accountingAppFields.forEach((accountingAppField) => {
        if (expenseFieldFormArray.length < 3) {
          const fieldData = unmappedFieldMap.get(accountingAppField.attribute_type);
          if (fieldData) {
            expenseFieldFormArray.push(this.createFormGroup(fieldData));
          }
        }
      });
    }
    return expenseFieldFormArray;
  }
}