import { FormGroup } from "@angular/forms";
import { EmailOption } from "../../common/advanced-settings.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { PaymentSyncDirection } from "../../enum/enum.model";


export type XeroAdvancedSettingWorkspaceGeneralSetting = {
  sync_fyle_to_xero_payments: boolean,
  sync_xero_to_fyle_payments: boolean,
  auto_create_destination_entity: boolean,
  change_accounting_period: boolean,
  auto_create_merchant_destination_entity: boolean
}

export type XeroAdvancedSettingGeneralMapping = {
  payment_account: DefaultDestinationAttribute
}

export type XeroAdvancedSettingWorkspaceSchedule = {
  enabled: boolean,
  interval_hours: number,
  start_datetime: Date,
  emails_selected: string[] | null,
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
  workspace_schedules: XeroAdvancedSettingWorkspaceSchedule,
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

export class XeroAdvancedSettingModel {
  static constructPayload(advancedSettingsForm: FormGroup): XeroAdvancedSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const advancedSettingPayload: XeroAdvancedSettingPost = {
      workspace_general_settings: {
        sync_fyle_to_xero_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.FYLE_TO_XERO ? true : false,
        sync_xero_to_fyle_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.XERO_TO_FYLE ? true : false,
        auto_create_destination_entity: advancedSettingsForm.get('autoCreateVendors')?.value,
        change_accounting_period: advancedSettingsForm.get('changeAccountingPeriod')?.value,
        auto_create_merchant_destination_entity: advancedSettingsForm.get('autoCreateMerchantDestinationEntity')?.value
      },
      general_mappings: {
        payment_account: advancedSettingsForm.get('billPaymentAccount')?.value ? advancedSettingsForm.get('billPaymentAccount')?.value : emptyDestinationAttribute
      },
      workspace_schedules: {
        enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
        interval_hours: advancedSettingsForm.get('exportScheduleFrequency')?.value ? advancedSettingsForm.get('exportScheduleFrequency')?.value : null,
        start_datetime: new Date(),
        emails_selected: advancedSettingsForm.get('emails')?.value ? advancedSettingsForm.get('emails')?.value : [],
        additional_email_options: advancedSettingsForm.get('addedEmail')?.value ? advancedSettingsForm.get('addedEmail')?.value : []
      }
    };
    return advancedSettingPayload;
  }
}
