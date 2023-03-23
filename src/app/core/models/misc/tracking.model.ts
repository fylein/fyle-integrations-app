import { QBDProgressPhase } from "../enum/enum.model";
import { QBDAdvancedSettingsGet } from "../qbd/qbd-configuration/advanced-setting.model";
import { QBDExportSettingGet } from "../qbd/qbd-configuration/export-setting.model";
import { QBDFieldMappingGet } from "../qbd/qbd-configuration/field-mapping.model";

export type UpdateEventAdditionalProperty = {
    phase: QBDProgressPhase,
    oldState: QBDAdvancedSettingsGet | QBDExportSettingGet | QBDFieldMappingGet,
    newState: QBDAdvancedSettingsGet | QBDExportSettingGet | QBDFieldMappingGet
  };