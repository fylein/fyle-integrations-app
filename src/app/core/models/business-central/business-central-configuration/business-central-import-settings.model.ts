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

export class BusinessCentralImportSettingsModel extends ImportSettingsModel {

    static mapAPIResponseToFormGroup(importSettings: BusinessCentralImportSettingsGet | null, businessCentralFields: IntegrationField[]): FormGroup {
        const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, businessCentralFields) : [] ;
        return new FormGroup({
            importCategories: new FormControl(importSettings?.import_categories ?? false),
            expenseFields: new FormArray(expenseFieldsArray)
        });
    }

    static createImportSettingPayload(importSettingsForm: FormGroup): BusinessCentralImportSettingsPost {
        const expenseFieldArray = importSettingsForm.value.expenseFields;
        const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);
        return {
            import_categories: importSettingsForm.get('importCategories')?.value,
            mapping_settings: mappingSettings
        };
    }

}
