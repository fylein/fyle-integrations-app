import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AdvancedSettingsModel, EmailOption } from "../../common/advanced-settings.model";

export type QbdDirectAdvancedSettingsPost = {
    line_level_memo_structure: string[],
    top_level_memo_structure: string[] | null,
    schedule_is_enabled: boolean,
    emails_selected: EmailOption[],
    emails_added: EmailOption[],
    interval_hours: number,
    auto_create_merchant_as_vendor: boolean
    auto_create_reimbursable_enitity: boolean,
}

export interface QbdDirectAdvancedSettingsGet extends QbdDirectAdvancedSettingsPost {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace_id: number
}

export class QbdDirectAdvancedSettingsModel extends AdvancedSettingsModel {

    static defaultMemoFields(): string[] {
        return ['employee_name', 'employee_email', 'merchant', 'purpose', 'expense_id', 'spent_on', 'expense_link'];
    }

    static defaultTopMemoOptions(): string[] {
        return ["employee_name", "expense_id"];
    }

    static mapAPIResponseToFormGroup(advancedSettings: QbdDirectAdvancedSettingsGet, isSkipExportEnabled: boolean): FormGroup {

        return new FormGroup({
            expenseMemoStructure: new FormControl(advancedSettings?.line_level_memo_structure && advancedSettings?.line_level_memo_structure.length > 0 ? advancedSettings?.line_level_memo_structure : this.defaultMemoFields(), Validators.required),
            topMemoStructure: new FormControl(advancedSettings?.top_level_memo_structure && advancedSettings?.top_level_memo_structure.length > 0 ? advancedSettings?.top_level_memo_structure[0] : this.defaultTopMemoOptions()[0], Validators.required),
            exportSchedule: new FormControl(advancedSettings?.schedule_is_enabled ? advancedSettings?.schedule_is_enabled : false),
            email: new FormControl(advancedSettings?.emails_selected.length > 0 ? advancedSettings?.emails_selected : []),
            exportScheduleFrequency: new FormControl(advancedSettings?.schedule_is_enabled ? advancedSettings?.interval_hours : 1),
            autoCreateReimbursableEnitity: new FormControl(advancedSettings?.auto_create_reimbursable_enitity ? advancedSettings?.auto_create_reimbursable_enitity : false),
            autoCreateMerchantsAsVendors: new FormControl(advancedSettings?.auto_create_merchant_as_vendor ? advancedSettings?.auto_create_merchant_as_vendor : false),
            skipExport: new FormControl(isSkipExportEnabled),
            searchOption: new FormControl('')
        });
    }

    static constructPayload (advancedSettingForm: FormGroup, adminEmails: EmailOption[]): QbdDirectAdvancedSettingsPost {

        const topMemo: string[] = [];
        topMemo.push(advancedSettingForm.value.topMemoStructure);

        const allSelectedEmails: EmailOption[] = advancedSettingForm.get('email')?.value;

        const selectedEmailsEmails = allSelectedEmails?.filter((email: EmailOption) => adminEmails.includes(email));

        const additionalEmails = allSelectedEmails?.filter((email: EmailOption) => !adminEmails.includes(email));

        const advancedSettingPayload: QbdDirectAdvancedSettingsPost = {
            line_level_memo_structure: advancedSettingForm.get('expenseMemoStructure')?.value ? advancedSettingForm.get('expenseMemoStructure')?.value : null,
            top_level_memo_structure: advancedSettingForm.get('topMemoStructure')?.value ? topMemo : null,
            schedule_is_enabled: advancedSettingForm.get('exportSchedule')?.value ? advancedSettingForm.get('exportSchedule')?.value : false,
            emails_selected: advancedSettingForm.get('exportSchedule')?.value ? selectedEmailsEmails : [],
            interval_hours: advancedSettingForm.get('exportSchedule')?.value ? advancedSettingForm.get('exportScheduleFrequency')?.value : null,
            auto_create_reimbursable_enitity: advancedSettingForm.get('autoCreateReimbursableEnitity')?.value ? advancedSettingForm.get('autoCreateReimbursableEnitity')?.value : false,
            auto_create_merchant_as_vendor: advancedSettingForm.get('autoCreateMerchantsAsVendors')?.value ? advancedSettingForm.get('autoCreateMerchantsAsVendors')?.value : false,
            emails_added: advancedSettingForm.get('exportSchedule')?.value ? additionalEmails : []
        };

        return advancedSettingPayload;
    }
}

