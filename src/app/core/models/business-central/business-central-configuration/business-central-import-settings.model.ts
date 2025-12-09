import { ImportSettingMappingRow } from '../../common/import-settings.model';

export type BusinessCentralImportSettings = {
  import_settings: {
    import_categories: boolean;
    import_vendors_as_merchants: boolean;
    charts_of_accounts: string[];
  };
  mapping_settings: ImportSettingMappingRow[] | [];
};

export interface BusinessCentralImportSettingsGet extends BusinessCentralImportSettings {
  id: number;
  workspace_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface BusinessCentralImportSettingsPost extends BusinessCentralImportSettings {}
