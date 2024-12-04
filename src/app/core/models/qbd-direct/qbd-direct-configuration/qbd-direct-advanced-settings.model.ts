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
        return ['employee_name', 'employee_email',  'card_number', 'purpose', 'merchant', 'spent_on', 'expense_key', 'expense_link'];
    }

    static defaultTopMemoOptions(): string[] {
        return ["employee_name", "Expense/Report ID"];
    }

    static topMemoExpenseKeyNameConversion(keys: string[]): string[] {
        keys.forEach((key: string, index: number) => {
            if (key === 'expense_key') {
                keys[index] = 'Expense/Report ID';
            }
        });
        return keys;
    }

    static formatMemoStructure(memoStructure: string[], defaultMemoOptions: string[]): string[] {
        const originMemo: string[] = [];
        defaultMemoOptions.forEach((field, index) => {
            const defaultIndex = memoStructure.indexOf(field);
            originMemo[defaultIndex] = field;
        });

        return originMemo.filter((item: string) => item !== null);
      }

    static mapAPIResponseToFormGroup(advancedSettings: QbdDirectAdvancedSettingsGet | null, isSkipExportEnabled: boolean): FormGroup {

        return new FormGroup({
            expenseMemoStructure: new FormControl(advancedSettings?.line_level_memo_structure && advancedSettings?.line_level_memo_structure.length > 0 ? this.formatMemoStructure(this.defaultMemoFields(), advancedSettings?.line_level_memo_structure) : this.defaultMemoFields(), Validators.required),
            topMemoStructure: new FormControl(advancedSettings?.top_level_memo_structure && advancedSettings?.top_level_memo_structure.length > 0 ? this.topMemoExpenseKeyNameConversion(advancedSettings?.top_level_memo_structure) : this.defaultTopMemoOptions(), Validators.required),
            exportSchedule: new FormControl(advancedSettings?.schedule_is_enabled ? advancedSettings?.schedule_is_enabled : false),
            email: new FormControl(advancedSettings?.emails_selected ? advancedSettings?.emails_selected : null),
            exportScheduleFrequency: new FormControl(advancedSettings?.schedule_is_enabled ? advancedSettings?.interval_hours : 1),
            autoCreateReimbursableEnitity: new FormControl(advancedSettings?.auto_create_reimbursable_enitity ? advancedSettings?.auto_create_reimbursable_enitity : false),
            autoCreateMerchantsAsVendors: new FormControl(advancedSettings?.auto_create_merchant_as_vendor ? advancedSettings?.auto_create_merchant_as_vendor : false),
            skipExport: new FormControl(isSkipExportEnabled),
            searchOption: new FormControl('')
        });
    }

    static constructPayload (advancedSettingForm: FormGroup, adminEmails: EmailOption[]): QbdDirectAdvancedSettingsPost {

        const topMemo: string[] = advancedSettingForm.controls.topMemoStructure.value;

        const index = topMemo.indexOf('Expense/Report ID');
        topMemo[index] = 'expense_key';

        const allSelectedEmails: EmailOption[] = advancedSettingForm.get('email')?.value;

        const selectedEmailsEmails = allSelectedEmails?.filter((email: EmailOption) => adminEmails.includes(email));

        const additionalEmails = allSelectedEmails?.filter((email: EmailOption) => !adminEmails.includes(email));

        const memo = advancedSettingForm.get('expenseMemoStructure')?.value ? advancedSettingForm.get('expenseMemoStructure')?.value : [];

        const advancedSettingPayload: QbdDirectAdvancedSettingsPost = {
            line_level_memo_structure: advancedSettingForm.get('expenseMemoStructure')?.value ? this.formatMemoStructure(this.defaultMemoFields(), memo) : [],
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

