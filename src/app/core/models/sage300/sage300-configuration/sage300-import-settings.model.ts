import { FormControl, FormGroup } from "@angular/forms";
import { ExpenseField } from "../../db/expense-field.model";
import { IntegrationFields } from "../../db/mapping.model";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

export type Sage300ImportSettingPost = {
    import_categories: boolean,
    import_vendors_as_merchants: boolean,
    mapping_settings: [],
    dependent_field_settings: null
}

export type Sage300DefaultFields = {
    destination_field: string,
    source_field: string,
    formController: string
}

export type Sage300ImportSettingsDependentFieldsSettings = {
    cost_code_field_name: string,
    cost_code_placeholder: string,
    cost_category_field_name: string,
    cost_category_placeholder: string,
    is_import_enabled: boolean
}

export type Sage300MappingSettings = {
    destination_field: string,
    import_to_fyle: boolean,
    is_custom: boolean,
    source_field: string,
    source_placeholder: string | null
}

export type Sage300ImportSettingGet = {
    import_categories: boolean,
    import_vendors_as_merchants: boolean,
    mapping_settings: Sage300MappingSettings[] | [],
    dependent_field_settings: Sage300ImportSettingsDependentFieldsSettings | null,
    workspaceId: number
}

export class ImportSettingModel {

    static generateDependentFieldValue(attribute_type: string, source_placeholder: string): ExpenseField {
        return {
          attribute_type: attribute_type,
          display_name: attribute_type,
          source_placeholder: source_placeholder,
          is_dependent: true
        };
    }

    static createFormGroup(data: Sage300MappingSettings): FormGroup {
        return new FormGroup ({
          source_field: new FormControl(data.source_field || '', RxwebValidators.unique()),
          destination_field: new FormControl(data.destination_field || '', RxwebValidators.unique()),
          import_to_fyle: new FormControl(data.import_to_fyle || false),
          is_custom: new FormControl(data.is_custom || false),
          source_placeholder: new FormControl(data.source_placeholder || null)
        });
      }

    static constructFormArray(importSettings: void | Sage300ImportSettingGet, sage300Fields: IntegrationFields[]): FormGroup[] {
        const expenseFieldFormArray: FormGroup[] = [];
        const mappedFieldMap = new Map<string, any>();
        const unmappedFieldMap = new Map<string, any>();

        // First loop to populate mappedFieldMap
        sage300Fields.forEach((sage300Field) => {
            const mappingSetting = importSettings?.mapping_settings.find(
                (setting) => setting.destination_field === sage300Field.attribute_type
            );

            const fieldData = mappingSetting || {
                destination_field: sage300Field.attribute_type,
                import_to_fyle: false,
                is_custom: false,
                source_field: '',
                source_placeholder: null
            };
            if (mappingSetting) {
                mappedFieldMap.set(sage300Field.attribute_type, fieldData);
            } else {
                unmappedFieldMap.set(sage300Field.attribute_type, fieldData);
            }

        });

        // Handle only mapped fields
        sage300Fields.forEach((sage300Field) => {
            const fieldData = mappedFieldMap.get(sage300Field.attribute_type);
            if (fieldData) {
                expenseFieldFormArray.push(this.createFormGroup(fieldData));
            }
        });

        if (mappedFieldMap.size === 0){
            sage300Fields.forEach((sage300Field) => {
                if (expenseFieldFormArray.length < 3) {
                const fieldData = unmappedFieldMap.get(sage300Field.attribute_type);
                if (fieldData) {
                    expenseFieldFormArray.push(this.createFormGroup(fieldData));
                }
                }
            });
        }

        return expenseFieldFormArray;
      }

    static mapAPIResponseToFormGroup(importSettings: Sage300ImportSettingGet | void, sage300Fields: IntegrationFields[]): FormGroup {
        return new FormGroup({
            importCategories: new FormControl(importSettings?.import_categories || null),
            importVendorAsMerchant: new FormControl(importSettings?.import_vendors_as_merchants || null),
            expenseFields: new FormControl([this.constructFormArray(importSettings, sage300Fields)]),
            isDependentImportEnabled: new FormControl(importSettings?.dependent_field_settings?.is_import_enabled || null),
            costCodes: new FormControl(importSettings?.dependent_field_settings?.cost_code_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_code_field_name, importSettings.dependent_field_settings.cost_code_placeholder) : null),
            costCategory: new FormControl(importSettings?.dependent_field_settings?.cost_category_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_category_field_name, importSettings.dependent_field_settings.cost_category_placeholder) : null)
        });
    }

}