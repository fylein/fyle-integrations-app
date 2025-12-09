import { BusinessCentralAdvancedSettingsGet } from '../business-central/business-central-configuration/business-central-advanced-settings.model';
import { BusinessCentralExportSettingGet } from '../business-central/business-central-configuration/business-central-export-setting.model';
import { BusinessCentralImportSettingsGet } from '../business-central/business-central-configuration/business-central-import-settings.model';
import { AccountingErrorType, AppName, IntacctErrorType, ProgressPhase, TrackingApp } from '../enum/enum.model';
import { QBDAdvancedSettingsGet } from '../qbd/qbd-configuration/qbd-advanced-setting.model';
import { QBDExportSettingGet } from '../qbd/qbd-configuration/qbd-export-setting.model';
import { QBDFieldMappingGet } from '../qbd/qbd-configuration/qbd-field-mapping.model';
import { Sage300AdvancedSettingGet } from '../sage300/sage300-configuration/sage300-advanced-settings.model';
import { Sage300ExportSettingGet } from '../sage300/sage300-configuration/sage300-export-setting.model';
import { Sage300ImportSettingGet } from '../sage300/sage300-configuration/sage300-import-settings.model';
import { TravelperkAdvancedSettingPost } from '../travelperk/travelperk-configuration/travelperk-advanced-settings.model';
import { TravelperkPaymentProfileSettingResponse } from '../travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';
import { AdvancedSettingsGet } from '../intacct/intacct-configuration/advanced-settings.model';
import { ExportSettingGet } from '../intacct/intacct-configuration/export-settings.model';
import { ImportSettingGet, ImportSettings } from '../intacct/intacct-configuration/import-settings.model';
import { QbdDirectAdvancedSettingsPost } from '../qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { QbdDirectExportSettingsPost } from '../qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { QbdDirectImportSettingPost } from '../qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model';
import { Workspace } from '../db/workspaces.model';

export type UpdateEventAdditionalProperty = {
  phase: ProgressPhase;
  oldState:
    | QBDAdvancedSettingsGet
    | QBDExportSettingGet
    | QBDFieldMappingGet
    | Sage300ExportSettingGet
    | Sage300ImportSettingGet
    | Sage300AdvancedSettingGet
    | null
    | BusinessCentralExportSettingGet
    | BusinessCentralImportSettingsGet
    | BusinessCentralAdvancedSettingsGet
    | TravelperkPaymentProfileSettingResponse
    | TravelperkAdvancedSettingPost
    | QbdDirectExportSettingsPost
    | QbdDirectImportSettingPost
    | QbdDirectAdvancedSettingsPost
    | Workspace
    | any;
  newState:
    | QBDAdvancedSettingsGet
    | QBDExportSettingGet
    | QBDFieldMappingGet
    | Sage300ExportSettingGet
    | Sage300ImportSettingGet
    | Sage300AdvancedSettingGet
    | BusinessCentralExportSettingGet
    | BusinessCentralImportSettingsGet
    | BusinessCentralAdvancedSettingsGet
    | TravelperkPaymentProfileSettingResponse
    | TravelperkAdvancedSettingPost
    | QbdDirectExportSettingsPost
    | QbdDirectImportSettingPost
    | QbdDirectAdvancedSettingsPost
    | Workspace
    | any;
};

export type UpdateIntacctEventAdditionalProperty = {
  phase: ProgressPhase;
  oldState: ExportSettingGet | ImportSettingGet | AdvancedSettingsGet;
  newState: ImportSettings;
};

export type MappingAlphabeticalFilterAdditionalProperty = {
  alphabetList: string[];
  allSelected: boolean;
  page: string;
};

export type ResolveMappingErrorProperty = {
  resolvedCount: number;
  unresolvedCount: number;
  totalCount: number;
  resolvedAllErrors: boolean;
  startTime: Date;
  endTime: Date;
  durationInSeconds: number;
  errorType: IntacctErrorType | AccountingErrorType;
};

export type TrackingAppMap = {
  [AppName.BUSINESS_CENTRAL]: TrackingApp.BUSINESS_CENTRAL;
  [AppName.SAGE300]: TrackingApp.SAGE300;
  [AppName.QBD]: TrackingApp.QBD;
  [AppName.BAMBOO_HR]: TrackingApp.BAMBOO_HR;
  [AppName.INTACCT]: TrackingApp.INTACCT;
  [AppName.QBO]: TrackingApp.QBO;
  [AppName.TRAVELPERK]: TrackingApp.TRAVELPERK;
  [AppName.NETSUITE]: TrackingApp.NETSUITE;
  [AppName.XERO]: TrackingApp.XERO;
  [AppName.QBD_DIRECT]: TrackingApp.QBD_DIRECT;
  [AppName.SAGE50]: TrackingApp.SAGE50;
};

export const trackingAppMap: TrackingAppMap = {
  [AppName.BUSINESS_CENTRAL]: TrackingApp.BUSINESS_CENTRAL,
  [AppName.SAGE300]: TrackingApp.SAGE300,
  [AppName.QBD]: TrackingApp.QBD,
  [AppName.BAMBOO_HR]: TrackingApp.BAMBOO_HR,
  [AppName.INTACCT]: TrackingApp.INTACCT,
  [AppName.QBO]: TrackingApp.QBO,
  [AppName.TRAVELPERK]: TrackingApp.TRAVELPERK,
  [AppName.NETSUITE]: TrackingApp.NETSUITE,
  [AppName.XERO]: TrackingApp.XERO,
  [AppName.QBD_DIRECT]: TrackingApp.QBD_DIRECT,
  [AppName.SAGE50]: TrackingApp.SAGE50,
};
