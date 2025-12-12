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

export type QBOImportFieldsAttributeCounts = {
  id: number,
  workspace: number,
  accounts_count: number,
  items_count: number,
  vendors_count: number,
  employees_count: number,
  departments_count: number,
  classes_count: number,
  customers_count: number,
  tax_codes_count: number,
  created_at: Date,
  updated_at: Date
}