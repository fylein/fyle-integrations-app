import { FormControl, FormGroup } from "@angular/forms";
import { EmailOption } from "../../common/advanced-settings.model";

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
    auto_map_vendor : boolean
}

export interface Sage300AdvancedSettingGet extends Sage300AdvancedSetting {
    id: number,
    created_at: Date,
    update_at: Date,
    workspace: number
}

export interface Sage300AdvancedSettingPost extends Sage300AdvancedSetting {}

export class Sage300AdvancedSettingModel {

    static mapAPIResponseToFormGroup(advancedSettings: Sage300AdvancedSettingGet | null): FormGroup {
        return new FormGroup({
            autoCreateMerchantDestinationEntity: new FormControl(advancedSettings?.auto_create_merchant_destination_entity ? true : false),
            syncSage300ToFylePayments: new FormControl(advancedSettings?.sync_sage_300_to_fyle_payments ? true : false),
            autoCreateDestinationEntity: new FormControl(advancedSettings?.auto_create_destination_entity ? true : false),
            memoStructure: new FormControl(advancedSettings?.memo_structure ? advancedSettings?.memo_structure : null ),
            defaultJobName: new FormControl(advancedSettings?.default_job_name ? advancedSettings?.default_job_name : null ),
            defaultJobId: new FormControl(advancedSettings?.default_job_id ? advancedSettings?.default_job_id : null ),
            scheduleEnabled: new FormControl(advancedSettings?.schedule_enabled ? true : false),
            emailsSelected: new FormControl(advancedSettings?.emails_selected ? advancedSettings?.emails_selected : null),
            emailsAdded: new FormControl(advancedSettings?.emails_added ? advancedSettings?.emails_added : null),
            autoMapVendor: new FormControl(advancedSettings?.auto_map_vendor ? true : false)
        });
    }

    static createAdvancedSettingPayload(advancedSettingsForm: FormGroup): Sage300AdvancedSettingPost {
        return {
            auto_create_merchant_destination_entity: advancedSettingsForm.get('auto_create_merchant_destination_entity')?.value ? advancedSettingsForm.get('auto_create_merchant_destination_entity')?.value : false,
            sync_sage_300_to_fyle_payments: advancedSettingsForm.get('sync_sage_300_to_fyle_payments')?.value ? advancedSettingsForm.get('sync_sage_300_to_fyle_payments')?.value : false,
            auto_create_destination_entity: advancedSettingsForm.get('auto_create_destination_entity')?.value ? advancedSettingsForm.get('auto_create_destination_entity')?.value : false,
            memo_structure: advancedSettingsForm.get('memo_structure')?.value ? advancedSettingsForm.get('memo_structure')?.value : null,
            default_job_name: advancedSettingsForm.get('default_job_name')?.value ? advancedSettingsForm.get('default_job_name')?.value : null,
            default_job_id: advancedSettingsForm.get('default_job_id')?.value ? advancedSettingsForm.get('default_job_id')?.value : null,
            schedule_enabled: advancedSettingsForm.get('schedule_enabled')?.value ? advancedSettingsForm.get('schedule_enabled')?.value : false,
            emails_selected: advancedSettingsForm.get('emails_selected')?.value ? advancedSettingsForm.get('emails_selected')?.value : null,
            emails_added: advancedSettingsForm.get('emails_added')?.value ? advancedSettingsForm.get('emails_added')?.value : false,
            auto_map_vendor: advancedSettingsForm.get('auto_map_vendor')?.value ? advancedSettingsForm.get('auto_map_vendor')?.value : false
        };
    }
}


