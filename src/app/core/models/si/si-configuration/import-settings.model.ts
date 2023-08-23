import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";

export type Configuration = {
    import_vendors_as_merchants: boolean,
    import_categories: boolean,
    import_tax_codes: boolean
}

export type GeneralMappings = {
    default_tax_code: DefaultDestinationAttribute
}

export type MappingSetting = {
    source_field: string,
    destination_field: string,
    import_to_fyle: boolean,
    is_custom: boolean,
    source_placeholder: null
}

export type DependantFieldSetting = {
    id: number,
    attribute_type: string,
    source_field_id: number,
    is_enabled: boolean
}

export type ImportSettingGet = {
    configurations: Configuration,
    general_mappings: GeneralMappings,
    mapping_settings: MappingSetting[],
    dependent_field_settings: DependantFieldSetting[]
    workspace_id: number
}

export type ImportSettingPost = {
    workspace_general_settings: Configuration,
    general_mappings: GeneralMappings,
    mapping_settings: MappingSetting[],
    dependent_field_settings: DependantFieldSetting[]
  }
export class ImportSettings {
}
