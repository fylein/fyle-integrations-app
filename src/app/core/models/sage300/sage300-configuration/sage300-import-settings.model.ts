import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ExpenseField, ImportSettingMappingRow, customField } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";
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

export type Sage300DependentImportFields = {
    options: customField[],
    source_field: string,
    formController: string,
    isDisabled: boolean
}

export type Sage300ImportSettingsDependentFieldSetting = {
    cost_code_field_name: string,
    cost_code_placeholder: string,
    cost_category_field_name: string,
    cost_category_placeholder: string,
    is_import_enabled: boolean
}

export type Sage300ImportSettingGet = {
    import_categories: boolean,
    import_vendors_as_merchants: boolean,
    mapping_settings: ImportSettingMappingRow[] | [],
    dependent_field_settings: Sage300ImportSettingsDependentFieldSetting | null,
    workspaceId: number
}

export class Sage300ImportSettingModel {

    static generateDependentFieldValue(attribute_type: string, source_placeholder: string): ExpenseField {
        return {
          attribute_type: attribute_type,
          display_name: attribute_type,
          source_placeholder: source_placeholder,
          is_dependent: true
        };
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

    static constructFormArray(importSettings: void | Sage300ImportSettingGet, sage300Fields: IntegrationField[]): FormGroup[] {
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

    static mapAPIResponseToFormGroup(importSettings: Sage300ImportSettingGet | null, sage300Fields: IntegrationField[]): FormGroup {
        const importsettings = importSettings ? importSettings : undefined;
        const expenseFieldsArray = this.constructFormArray(importsettings, sage300Fields);

        return new FormGroup({
            importCategories: new FormControl(importSettings?.import_categories ? importSettings.import_categories : false),
            importVendorAsMerchant: new FormControl(importSettings?.import_vendors_as_merchants ? importSettings.import_vendors_as_merchants : false),
            expenseFields: new FormArray(expenseFieldsArray),
            isDependentImportEnabled: new FormControl(importSettings?.dependent_field_settings?.is_import_enabled ? importSettings.dependent_field_settings.is_import_enabled : false),
            costCodes: new FormControl(importSettings?.dependent_field_settings?.cost_code_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_code_field_name, importSettings.dependent_field_settings.cost_code_placeholder) : null),
            costCategory: new FormControl(importSettings?.dependent_field_settings?.cost_category_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_category_field_name, importSettings.dependent_field_settings.cost_category_placeholder) : null),
            dependentFieldImportToggle: new FormControl(true)
        });
    }

}