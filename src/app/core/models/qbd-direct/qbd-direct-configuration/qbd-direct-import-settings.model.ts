import { ImportSettingMappingRow } from '../../common/import-settings.model';

export type QdbDirectImportSetting = {
  import_account_as_category: boolean;
  import_item_as_category: boolean;
  import_vendor_as_merchant: boolean;
  chart_of_accounts: string[];
  import_code_fields: string[];
};

export type QbdDirectImportSettingPost = {
  import_settings: QdbDirectImportSetting;
  mapping_settings: ImportSettingMappingRow[];
  workspace_id: number;
};

export interface QbdDirectImportSettingGet extends QbdDirectImportSettingPost {}
