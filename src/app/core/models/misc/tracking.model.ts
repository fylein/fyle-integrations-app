import type { BusinessCentralAdvancedSettingsGet } from "../business-central/business-central-configuration/business-central-advanced-settings.model";
import type { BusinessCentralExportSettingGet } from "../business-central/business-central-configuration/business-central-export-setting.model";
import type { BusinessCentralImportSettingsGet } from "../business-central/business-central-configuration/business-central-import-settings.model";
import type { AccountingErrorType, IntacctErrorType, ProgressPhase } from "../enum/enum.model";
import { AppName, TrackingApp } from "../enum/enum.model";
import type { QBDAdvancedSettingsGet } from "../qbd/qbd-configuration/qbd-advanced-setting.model";
import type { QBDExportSettingGet } from "../qbd/qbd-configuration/qbd-export-setting.model";
import type { QBDFieldMappingGet } from "../qbd/qbd-configuration/qbd-field-mapping.model";
import type { Sage300AdvancedSettingGet } from "../sage300/sage300-configuration/sage300-advanced-settings.model";
import type { Sage300ExportSettingGet } from "../sage300/sage300-configuration/sage300-export-setting.model";
import type { Sage300ImportSettingGet } from "../sage300/sage300-configuration/sage300-import-settings.model";
import type { TravelperkAdvancedSettingPost } from "../travelperk/travelperk-configuration/travelperk-advanced-settings.model";
import type { TravelperkPaymentProfileSettingResponse } from "../travelperk/travelperk-configuration/travelperk-payment-profile-settings.model";
import type { AdvancedSettingsGet } from "../intacct/intacct-configuration/advanced-settings.model";
import type { ExportSettingGet } from "../intacct/intacct-configuration/export-settings.model";
import type { ImportSettingGet, ImportSettings } from "../intacct/intacct-configuration/import-settings.model";

export interface UpdateEventAdditionalProperty {
    phase: ProgressPhase,
    oldState: QBDAdvancedSettingsGet | QBDExportSettingGet | QBDFieldMappingGet | Sage300ExportSettingGet |  Sage300ImportSettingGet | Sage300AdvancedSettingGet | null | BusinessCentralExportSettingGet | BusinessCentralImportSettingsGet | BusinessCentralAdvancedSettingsGet | TravelperkPaymentProfileSettingResponse | TravelperkAdvancedSettingPost,
    newState: QBDAdvancedSettingsGet | QBDExportSettingGet | QBDFieldMappingGet | Sage300ExportSettingGet |  Sage300ImportSettingGet | Sage300AdvancedSettingGet | BusinessCentralExportSettingGet | BusinessCentralImportSettingsGet | BusinessCentralAdvancedSettingsGet | TravelperkPaymentProfileSettingResponse | TravelperkAdvancedSettingPost
  }

export interface UpdateIntacctEventAdditionalProperty {
    phase: ProgressPhase,
    oldState: ExportSettingGet | ImportSettingGet | AdvancedSettingsGet,
    newState: ImportSettings
  }

export interface MappingAlphabeticalFilterAdditionalProperty {
    alphabetList: string[],
    allSelected: boolean,
    page: string
  }

export interface ResolveMappingErrorProperty {
  resolvedCount: number,
  unresolvedCount: number,
  totalCount: number,
  resolvedAllErrors: boolean,
  startTime: Date,
  endTime: Date,
  durationInSeconds: number,
  errorType: IntacctErrorType | AccountingErrorType
}

export interface TrackingAppMap {
  [AppName.BUSINESS_CENTRAL]: TrackingApp.BUSINESS_CENTRAL,
  [AppName.SAGE300]: TrackingApp.SAGE300,
  [AppName.QBD]: TrackingApp.QBD,
  [AppName.BAMBOO_HR]: TrackingApp.BAMBOO_HR,
  [AppName.INTACCT]: TrackingApp.INTACCT,
  [AppName.QBO]: TrackingApp.QBO,
  [AppName.TRAVELPERK]: TrackingApp.TRAVELPERK,
  [AppName.NETSUITE]: TrackingApp.NETSUITE,
  [AppName.XERO]: TrackingApp.XERO
}

export const trackingAppMap: TrackingAppMap = {
  [AppName.BUSINESS_CENTRAL]: TrackingApp.BUSINESS_CENTRAL,
  [AppName.SAGE300]: TrackingApp.SAGE300,
  [AppName.QBD]: TrackingApp.QBD,
  [AppName.BAMBOO_HR]: TrackingApp.BAMBOO_HR,
  [AppName.INTACCT]: TrackingApp.INTACCT,
  [AppName.QBO]: TrackingApp.QBO,
  [AppName.TRAVELPERK]: TrackingApp.TRAVELPERK,
  [AppName.NETSUITE]: TrackingApp.NETSUITE,
  [AppName.XERO]: TrackingApp.XERO
};
