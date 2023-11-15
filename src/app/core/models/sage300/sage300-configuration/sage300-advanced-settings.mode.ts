import { FormControl, FormGroup } from "@angular/forms";
import { ConditionField, EmailOption, ExpenseFilter, ExpenseFilterGetResponse, ExpenseFilterPayload} from "../../common/advanced-settings.model";
import { JoinOption } from "../../enum/enum.model";

export type AdvancedSettingValidatorRule = {
    condition1: string[];
    condition2: string[];
    operator1: string[];
    operator2: string[];
  };

export type Sage300AdvancedSetting = {
    auto_create_merchant_destination_entity: boolean,
    sync_sage_300_to_fyle_payments: boolean,
    auto_create_destination_entity: boolean,
    memo_structure: string[],
    default_job_name: string,
    default_job_id: number
    schedule_enabled: boolean,
    emails_selected: EmailOption[],
    emails_added: EmailOption[],
    auto_map_vendor: boolean
}

export interface Sage300AdvancedSettingGet extends Sage300AdvancedSetting {
    id: number,
    created_at: Date,
    update_at: Date,
    workspace: number
}

export interface Sage300AdvancedSettingPost extends Sage300AdvancedSetting {}

export class Sage300AdvancedSettingModel {

    static constructSkipExportPayload(valueField: ExpenseFilterPayload, valueOption1: any[]): ExpenseFilter {
        const op:string = (valueField.operator) as string;
        return {
          condition: valueField.condition.field_name,
          operator: valueField.operator,
          values:
            valueField.condition.type === 'DATE' ||
            valueField.operator === 'isnull' || valueField.condition.field_name === 'report_title' ? valueField.value : valueOption1,
          rank: valueField.rank,
          join_by: valueField?.join_by ? JoinOption[valueField.join_by as JoinOption] : null,
          is_custom: valueField.condition.is_custom,
          custom_field_type: valueField.condition?.is_custom ? valueField.condition.type : null
        };
      }

    static mapAPIResponseToFormGroup(advancedSettings: Sage300AdvancedSettingGet | null): FormGroup {
        return new FormGroup({
            autoCreateMerchantDestinationEntity: new FormControl(advancedSettings?.auto_create_merchant_destination_entity ? true : false),
            syncSage300ToFylePayments: new FormControl(advancedSettings?.sync_sage_300_to_fyle_payments ? true : false),
            autoCreateDestinationEntity: new FormControl(advancedSettings?.auto_create_destination_entity ? true : false),
            memoStructure: new FormControl(advancedSettings?.memo_structure ? advancedSettings?.memo_structure : null ),
            defaultJobName: new FormControl(advancedSettings?.default_job_name ? advancedSettings?.default_job_name : null ),
            scheduleEnabled: new FormControl(advancedSettings?.schedule_enabled ? true : false),
            email: new FormControl(advancedSettings?.emails_selected ? advancedSettings?.emails_selected : []),
            emailsAdded: new FormControl(advancedSettings?.emails_added ? advancedSettings?.emails_added : null),
            autoMapVendor: new FormControl(advancedSettings?.auto_map_vendor ? true : false),
            scheduleAutoExportFrequency: new FormControl(1),
            topLevelMemo: new FormControl(null)
        });
    }

    static createAdvancedSettingPayload(advancedSettingsForm: FormGroup): Sage300AdvancedSettingPost {
        return {
            auto_create_merchant_destination_entity: advancedSettingsForm.get('auto_create_merchant_destination_entity')?.value ? advancedSettingsForm.get('auto_create_merchant_destination_entity')?.value : false,
            sync_sage_300_to_fyle_payments: advancedSettingsForm.get('sync_sage_300_to_fyle_payments')?.value ? advancedSettingsForm.get('sync_sage_300_to_fyle_payments')?.value : false,
            auto_create_destination_entity: advancedSettingsForm.get('auto_create_destination_entity')?.value ? advancedSettingsForm.get('auto_create_destination_entity')?.value : false,
            memo_structure: advancedSettingsForm.get('memo_structure')?.value ? advancedSettingsForm.get('memo_structure')?.value : null,
            default_job_name: advancedSettingsForm.get('default_job_name')?.value ? advancedSettingsForm.get('default_job_name')?.value.name : null,
            default_job_id: advancedSettingsForm.get('default_job_name')?.value ? advancedSettingsForm.get('default_job_name')?.value.destination_id : null,
            schedule_enabled: advancedSettingsForm.get('schedule_enabled')?.value ? advancedSettingsForm.get('schedule_enabled')?.value : false,
            emails_selected: advancedSettingsForm.get('emails_selected')?.value ? advancedSettingsForm.get('emails_selected')?.value : null,
            emails_added: advancedSettingsForm.get('emails_added')?.value ? advancedSettingsForm.get('emails_added')?.value : false,
            auto_map_vendor: advancedSettingsForm.get('auto_map_vendor')?.value ? advancedSettingsForm.get('auto_map_vendor')?.value : false
        };
    }
}


