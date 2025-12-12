import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ExpenseField, ImportCodeFieldConfigType, ImportSettingMappingRow, ImportSettingsCustomFieldRow } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";
import { ImportSettingsService } from "src/app/core/services/common/import-settings.service";

export type Sage300DefaultFields = {
    destination_field: string,
    source_field: string,
    formController: string,
    import_code: string,
    is_auto_import_enabled?: boolean,
    count?: number
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
        import_vendors_as_merchants: boolean,
        add_commitment_details: boolean,
        import_code_fields: string[] | [],
    },
    mapping_settings: ImportSettingMappingRow[] | [],
    dependent_field_settings: Sage300ImportSettingsDependentFieldSetting | null,
}

export interface  Sage300ImportSettingGet extends Sage300ImportSetting {
    workspaceId: number
}

export interface  Sage300ImportSettingPost extends Sage300ImportSetting {}