import { ProgressPhase } from "../enum/enum.model";
import { QBDAdvancedSettingsGet } from "../qbd/qbd-configuration/advanced-setting.model";
import { QBDExportSettingGet } from "../qbd/qbd-configuration/export-setting.model";
import { QBDFieldMappingGet } from "../qbd/qbd-configuration/field-mapping.model";
import { ExportSettingGet } from "../si/si-configuration/export-settings.model";
import { ImportSettingGet, ImportSettings } from "../si/si-configuration/import-settings.model";

export type UpdateEventAdditionalProperty = {
    phase: ProgressPhase,
    oldState: QBDAdvancedSettingsGet | QBDExportSettingGet | QBDFieldMappingGet,
    newState: QBDAdvancedSettingsGet | QBDExportSettingGet | QBDFieldMappingGet
  };

  export type UpdateIntacctEventAdditionalProperty = {
    phase: ProgressPhase,
    oldState: ExportSettingGet | ImportSettingGet,
    newState: ImportSettings
  };