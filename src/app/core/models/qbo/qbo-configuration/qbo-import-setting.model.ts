import { ImportSettingMappingRow } from "../../common/import-settings.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { MappingSetting } from "../../db/mapping-setting.model";

export type QBOImportSettingWorkspaceGeneralSetting = {
  import_categories: boolean,
  import_items: boolean,
  import_vendors_as_merchants: boolean,
  charts_of_accounts: string[],
  import_tax_codes: boolean,
  import_code_fields: string[]
}

export type QBOImportSettingGeneralMapping = {
  default_tax_code: DefaultDestinationAttribute
}

export type QBOImportSettingPost = {
  workspace_general_settings: QBOImportSettingWorkspaceGeneralSetting,
  general_mappings: QBOImportSettingGeneralMapping,
  mapping_settings: ImportSettingMappingRow[] | []
}


export type QBOImportSettingGet = {
  workspace_general_settings: QBOImportSettingWorkspaceGeneralSetting,
  general_mappings: QBOImportSettingGeneralMapping,
  mapping_settings: MappingSetting[],
  workspace_id: number
}