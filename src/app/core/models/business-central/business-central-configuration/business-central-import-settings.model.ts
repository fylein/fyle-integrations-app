import { FormArray, FormControl, FormGroup } from "@angular/forms";
import type { ImportSettingMappingRow } from "../../common/import-settings.model";
import { ImportSettingsModel } from "../../common/import-settings.model";
import type { IntegrationField } from "../../db/mapping.model";

export interface BusinessCentralImportSettings {
    import_settings: {
        import_categories: boolean,
        import_vendors_as_merchants: boolean
    }
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
            importCategories: new FormControl(importSettings?.import_settings?.import_categories ?? false),
            importVendorAsMerchant: new FormControl(importSettings?.import_settings?.import_vendors_as_merchants ?? false ),
            expenseFields: new FormArray(expenseFieldsArray)
        });
    }

    static createImportSettingPayload(importSettingsForm: FormGroup): BusinessCentralImportSettingsPost {
        const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
        const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);
        return {
            import_settings: {
                import_categories: importSettingsForm.get('importCategories')?.value,
                import_vendors_as_merchants: importSettingsForm.get('importVendorAsMerchant')?.value
            },
            mapping_settings: mappingSettings
        };
    }

}
