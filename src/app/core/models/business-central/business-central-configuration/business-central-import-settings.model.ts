import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ImportSettingMappingRow } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

export type BusinessCentralImportSettings = {
    import_categories: boolean,
    mapping_settings: ImportSettingMappingRow[] | []
}

export interface BusinessCentralImportSettingsGet extends BusinessCentralImportSettings {
    id: number,
    workspace_id: number,
    created_at: Date,
    updated_at: Date
}

export interface BusinessCentralImportSettingsPost extends BusinessCentralImportSettings {}

export class BusinessCentralImportSettingsModel {

    static createFormGroup(data: ImportSettingMappingRow): FormGroup {
        return new FormGroup ({
          source_field: new FormControl(data.source_field || '', RxwebValidators.unique()),
          destination_field: new FormControl(data.destination_field || '', RxwebValidators.unique()),
          import_to_fyle: new FormControl(data.import_to_fyle || false),
          is_custom: new FormControl(data.is_custom || false),
          source_placeholder: new FormControl(data.source_placeholder || null)
        });
    }

    static constructFormArray(importSettings: null | BusinessCentralImportSettingsGet, businessCentralFields: IntegrationField[]): FormGroup[] {
        const expenseFieldFormArray: FormGroup[] = [];
        const mappedFieldMap = new Map<string, any>();
        const unmappedFieldMap = new Map<string, any>();

        // First loop to populate mappedFieldMap
        businessCentralFields.forEach((businessCentralField) => {
            const mappingSetting = importSettings?.mapping_settings.find(
                (setting) => setting.destination_field === businessCentralField.attribute_type
            );

            const fieldData = mappingSetting || {
                destination_field: businessCentralField.attribute_type,
                import_to_fyle: false,
                is_custom: false,
                source_field: '',
                source_placeholder: null
            };
            if (mappingSetting) {
                mappedFieldMap.set(businessCentralField.attribute_type, fieldData);
            } else {
                unmappedFieldMap.set(businessCentralField.attribute_type, fieldData);
            }

        });

        // Handle only mapped fields
        businessCentralFields.forEach((businessCentralField) => {
            const fieldData = mappedFieldMap.get(businessCentralField.attribute_type);
            if (fieldData) {
                expenseFieldFormArray.push(this.createFormGroup(fieldData));
            }
        });

        if (mappedFieldMap.size === 0){
            businessCentralFields.forEach((businessCentralField) => {
                if (expenseFieldFormArray.length < 3) {
                const fieldData = unmappedFieldMap.get(businessCentralField.attribute_type);
                if (fieldData) {
                    expenseFieldFormArray.push(this.createFormGroup(fieldData));
                }
                }
            });
        }
        return expenseFieldFormArray;
    }

    static mapAPIResponseToFormGroup(importSettings: BusinessCentralImportSettingsGet | null, businessCentralFields: IntegrationField[]): FormGroup {
        const expenseFieldsArray = this.constructFormArray(importSettings, businessCentralFields);
        return new FormGroup({
            importCategories: new FormControl(importSettings?.import_categories ?? false),
            expenseFields: new FormArray(expenseFieldsArray)
        });
    }

    static createImportSettingPayload(importSettingsForm: FormGroup, importSettings: BusinessCentralImportSettingsGet): BusinessCentralImportSettingsPost {
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
            import_categories: importSettingsForm.get('importCategories')?.value,
            mapping_settings: mappingSettings
        };
    }

}
