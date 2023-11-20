import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ExpenseField, ImportSettingMappingRow, ImportSettingsCustomFieldRow } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

export type Sage300DefaultFields = {
    destination_field: string,
    source_field: string,
    formController: string
}

export type Sage300DependentImportFields = {
    options: ImportSettingsCustomFieldRow[],
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

export type Sage300ImportSetting = {
    import_settings: {
        import_categories: boolean,
        import_vendors_as_merchants: boolean
    },
    mapping_settings: ImportSettingMappingRow[] | [],
    dependent_field_settings: Sage300ImportSettingsDependentFieldSetting | null,
}

export interface  Sage300ImportSettingGet extends Sage300ImportSetting {
    workspaceId: number
}

export interface  Sage300ImportSettingPost extends Sage300ImportSetting {}

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

    static constructFormArray(importSettings: null | Sage300ImportSettingGet, sage300Fields: IntegrationField[]): FormGroup[] {
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
        const expenseFieldsArray = this.constructFormArray(importSettings, sage300Fields);
        return new FormGroup({
            importCategories: new FormControl(importSettings?.import_settings?.import_categories ? importSettings.import_settings.import_categories : false),
            importVendorAsMerchant: new FormControl(importSettings?.import_settings?.import_vendors_as_merchants ? importSettings.import_settings.import_vendors_as_merchants : false),
            expenseFields: new FormArray(expenseFieldsArray),
            isDependentImportEnabled: new FormControl(importSettings?.dependent_field_settings?.is_import_enabled ? importSettings.dependent_field_settings.is_import_enabled : false),
            costCodes: new FormControl(importSettings?.dependent_field_settings?.cost_code_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_code_field_name, importSettings.dependent_field_settings.cost_code_placeholder) : null),
            costCategory: new FormControl(importSettings?.dependent_field_settings?.cost_category_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_category_field_name, importSettings.dependent_field_settings.cost_category_placeholder) : null),
            dependentFieldImportToggle: new FormControl(true)
        });
    }

    static createImportSettingPayload(importSettingsForm: FormGroup, importSettings: Sage300ImportSettingGet): Sage300ImportSettingPost {
        const expenseFieldArray = importSettingsForm.value.expenseFields;

        // First filter out objects where import_to_fyle is false
        const filteredExpenseFieldArray = expenseFieldArray.filter((field: ImportSettingMappingRow) => field.destination_field && field.source_field);

        // Then map over the filtered array
        const mappingSettings = filteredExpenseFieldArray.map((field: ImportSettingMappingRow) => {
          return {
            source_field: field.source_field.toUpperCase(),
            destination_field: field.destination_field,
            import_to_fyle: field.import_to_fyle,
            is_custom: (field.source_field.toUpperCase() === 'PROJECT' || field.source_field.toUpperCase() === 'COST_CENTER') ? false : true,
            source_placeholder: field.source_placeholder
          };
        });
        return {
            import_settings: {
                import_categories: importSettingsForm.get('importCategories')?.value,
                import_vendors_as_merchants: importSettingsForm.get('importVendorAsMerchant')?.value
            },
            mapping_settings: mappingSettings,
            dependent_field_settings: importSettingsForm.get('isDependentImportEnabled')?.value ? {
                cost_code_field_name: importSettingsForm.get('costCodes')?.value ? importSettingsForm.get('costCodes')?.value.attribute_type : (importSettings?.dependent_field_settings?.cost_code_field_name ? importSettings.dependent_field_settings?.cost_code_field_name : null),
                cost_code_placeholder: importSettingsForm.get('costCodes')?.value ? importSettingsForm.get('costCodes')?.value.source_placeholder : (importSettings?.dependent_field_settings?.cost_code_placeholder ? importSettings.dependent_field_settings?.cost_code_placeholder : null),
                cost_category_field_name: importSettingsForm.get('costCategory')?.value ? importSettingsForm.get('costCategory')?.value.attribute_type : (importSettings?.dependent_field_settings?.cost_category_field_name ? importSettings.dependent_field_settings?.cost_category_field_name : null),
                cost_category_placeholder: importSettingsForm.get('costCategory')?.value ? importSettingsForm.get('costCategory')?.value.source_placeholder : (importSettings?.dependent_field_settings?.cost_category_placeholder ? importSettings.dependent_field_settings?.cost_category_placeholder : null),
                is_import_enabled: importSettingsForm.get('isDependentImportEnabled')?.value
            } : null
        };
    }

}