import { EmailOption } from "../../common/advanced-settings.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { PaymentSyncDirection } from "../../enum/enum.model";


export type XeroAdvancedSettingWorkspaceGeneralSetting = {
  sync_fyle_to_xero_payments: boolean,
  sync_xero_to_fyle_payments: boolean,
  auto_create_destination_entity: boolean,
  change_accounting_period: boolean,
  auto_create_merchant_destination_entity: boolean,
  memo_structure: string[]
}

export type XeroAdvancedSettingGeneralMapping = {
  payment_account: DefaultDestinationAttribute
}

export type XeroAdvancedSettingWorkspaceSchedule = {
  enabled: boolean,
  interval_hours: number,
  start_datetime: Date,
  emails_selected: string[] | null,
  is_real_time_export_enabled: boolean,
  additional_email_options: EmailOption[]
}

export type XeroAdvancedSettingWorkspaceSchedulePost = {
  hours: number;
  schedule_enabled: boolean;
  emails_selected: string[];
  email_added: EmailOption[]
}

export type XeroAdvancedSettingPost = {
  workspace_general_settings: XeroAdvancedSettingWorkspaceGeneralSetting,
  general_mappings: XeroAdvancedSettingGeneralMapping,
  workspace_schedules: XeroAdvancedSettingWorkspaceSchedule
}

export type XeroAdvancedSettingGet = {
  workspace_general_settings: XeroAdvancedSettingWorkspaceGeneralSetting,
  general_mappings: XeroAdvancedSettingGeneralMapping,
  workspace_schedules: XeroAdvancedSettingWorkspaceSchedule,
  workspace_id:number
}

export type XeroAdvancedSettingAddEmailModel = {
  workspaceId: number;
  hours: number;
  schedulEnabled: boolean;
  selectedEmails: string[];
}

export interface XeroAdvancedSettingFormOption extends SelectFormOption {
  value: PaymentSyncDirection | number | 'None';
}
