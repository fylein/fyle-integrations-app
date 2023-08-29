import { FormGroup } from "@angular/forms";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";

export type Configuration = {
    import_vendors_as_merchants: boolean,
    import_categories: boolean,
    import_tax_codes: boolean
}

export type ImportSettingGeneralMapping = {
    default_tax_code: DefaultDestinationAttribute | null
}

export type MappingSetting = {
    source_field: string,
    destination_field: string,
    import_to_fyle: boolean,
    is_custom: boolean,
    source_placeholder: null
}

export type DependentFieldSetting = {
    id: number,
    project_field_id: number,
    cost_code_field_id: number,
    cost_type_field_id: number,
    is_import_enabled: boolean,
    cost_code_field_name: string,
    cost_code_placeholder: null,
    cost_type_field_name: string,
    cost_type_placeholder: null,
    last_successful_import_at: string,
    created_at: string,
    updated_at: string,
    workspace: 1
}

export type ImportSettingGet = {
    configurations: Configuration,
    general_mappings: ImportSettingGeneralMapping,
    mapping_settings: MappingSetting[],
    dependent_field_settings: DependentFieldSetting
    workspace_id: number
}

export type ImportSettingPost = {
    configurations: Configuration,
    general_mappings: ImportSettingGeneralMapping,
    mapping_settings: MappingSetting[],
    dependent_field_settings: DependentFieldSetting
  }
export class ImportSettings {
    static constructPayload(importSettings: FormGroup): ImportSettingPost{
        console.log(importSettings.value.expenseField);
        const importSettingPayload: ImportSettingPost = {
                configurations: {
                    import_categories: importSettings.value.import_categories,
                    import_tax_codes: importSettings.value.import_tax_codes,
                    import_vendors_as_merchants: importSettings.value.import_vendors_as_merchants
                },
                general_mappings: {
                    default_tax_code: importSettings.value.import_vendors_as_merchants ? {
                        name: importSettings.value.sageIntacctTaxCodes.attribute_type,
                        id: importSettings.value.sageIntacctTaxCodes.id
                    } : null
                },
                mapping_settings: [
                    {
                        source_field: "PROJECT",
                        destination_field: "PROJECT",
                        import_to_fyle: true,
                        is_custom: false,
                        source_placeholder: null
                    }
                ],
                dependent_field_settings: {
                    id: 1,
                    project_field_id: 182303,
                    cost_code_field_id: 226513,
                    cost_type_field_id: 226514,
                    is_import_enabled: true,
                    cost_code_field_name: "Wow Cost Code",
                    cost_code_placeholder: null,
                    cost_type_field_name: "Wow Cost Type",
                    cost_type_placeholder: null,
                    last_successful_import_at: "2023-07-14T07:19:49.577045Z",
                    created_at: "2023-07-14T07:19:01.724818Z",
                    updated_at: "2023-07-14T07:19:01.724866Z",
                    workspace: 1
                }
            };

        return importSettingPayload;
    }
}