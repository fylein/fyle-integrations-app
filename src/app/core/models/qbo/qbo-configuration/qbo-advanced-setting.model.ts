import { EmailOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";


export type QBOAdvancedSettingWorkspaceGeneralSetting = {
  sync_fyle_to_qbo_payments: boolean,
  sync_qbo_to_fyle_payments: boolean,
  auto_create_destination_entity: boolean,
  auto_create_merchants_as_vendors: boolean,
  je_single_credit_line: boolean,
  change_accounting_period: boolean,
  memo_structure: string[]
}

export type QBOAdvancedSettingGeneralMapping = {
  bill_payment_account: DefaultDestinationAttribute
}

export type QBOAdvancedSettingWorkspaceSchedule = {
  enabled: boolean,
  interval_hours: number,
  emails_selected: string[] | null,
  is_real_time_export_enabled: boolean,
  additional_email_options: EmailOption[]
}

export type QBOAdvancedSettingWorkspaceSchedulePost = {
  hours: number;
  schedule_enabled: boolean;
  emails_selected: string[];
  email_added: EmailOption
}

export type QBOAdvancedSettingPost = {
  workspace_general_settings: QBOAdvancedSettingWorkspaceGeneralSetting,
  general_mappings: QBOAdvancedSettingGeneralMapping,
  workspace_schedules: QBOAdvancedSettingWorkspaceSchedule,
}

export type QBOAdvancedSettingGet = {
  workspace_general_settings: QBOAdvancedSettingWorkspaceGeneralSetting,
  general_mappings: QBOAdvancedSettingGeneralMapping,
  workspace_schedules: QBOAdvancedSettingWorkspaceSchedule,
  workspace_id:number
}

export type QBOAdvancedSettingAddEmailModel = {
  workspaceId: number;
  hours: number;
  schedulEnabled: boolean;
  selectedEmails: string[];
}
