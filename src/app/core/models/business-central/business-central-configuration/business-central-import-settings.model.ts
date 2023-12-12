import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ImportSettingMappingRow, ImportSettingsModel } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";

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

    static mapAPIResponseToFormGroup(importSettings: BusinessCentralImportSettingsGet | null, businessCentralFields: IntegrationField[]): FormGroup {
        const expenseFieldsArray = importSettings?.mapping_settings ? ImportSettingsModel.constructFormArray(importSettings.mapping_settings, businessCentralFields) : [] ;
        return new FormGroup({
            importCategories: new FormControl(importSettings?.import_categories ?? false),
            expenseFields: new FormArray(expenseFieldsArray),
            importLocation: new FormControl(expenseFieldsArray.length > 0 ? true : false)
        });
    }

    static createImportSettingPayload(importSettingsForm: FormGroup): BusinessCentralImportSettingsPost {
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
