import { ProgressPhase } from "../enum/enum.model";
import { QBDAdvancedSettingsGet } from "../qbd/qbd-configuration/advanced-setting.model";
import { QBDExportSettingGet } from "../qbd/qbd-configuration/export-setting.model";
import { QBDFieldMappingGet } from "../qbd/qbd-configuration/field-mapping.model";
import { Sage300ExportSettingGet } from "../sage300/sage300-configuration/sage300-export-setting.model";
import { AdvancedSettingsGet } from "../si/si-configuration/advanced-settings.model";
import { ExportSettingGet } from "../si/si-configuration/export-settings.model";
import { ImportSettingGet, ImportSettings } from "../si/si-configuration/import-settings.model";

export type UpdateEventAdditionalProperty = {
    phase: ProgressPhase,
    oldState: QBDAdvancedSettingsGet | QBDExportSettingGet | QBDFieldMappingGet | Sage300ExportSettingGet,
    newState: QBDAdvancedSettingsGet | QBDExportSettingGet | QBDFieldMappingGet | Sage300ExportSettingGet
  };

  export type UpdateIntacctEventAdditionalProperty = {
    phase: ProgressPhase,
    oldState: ExportSettingGet | ImportSettingGet | AdvancedSettingsGet,
    newState: ImportSettings
  };

  export type MappingAlphabeticalFilterAdditionalProperty = {
    alphabetList: string[],
    allSelected: boolean,
    page: string
  };