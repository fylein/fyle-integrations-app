import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AdvancedSettingsModel, EmailOption } from "../../common/advanced-settings.model";
import { brandingFeatureConfig } from "src/app/branding/branding-config";

export type QbdDirectAdvancedSettingsPost = {
    line_level_memo_structure: string[],
    top_level_memo_structure: string[] | null,
    schedule_is_enabled: boolean,
    emails_selected: EmailOption[],
    emails_added: EmailOption[],
    interval_hours: number,
    auto_create_merchant_as_vendor: boolean
    auto_create_reimbursable_entity: boolean,
    is_real_time_export_enabled: boolean
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
        return ["employee_name", "expense_key"];
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

    static mapAPIResponseToFormGroup(advancedSettings: QbdDirectAdvancedSettingsGet | null, isSkipExportEnabled: boolean, isOnboarding: boolean): FormGroup {
        return new FormGroup({
            expenseMemoStructure: new FormControl(advancedSettings?.line_level_memo_structure && advancedSettings?.line_level_memo_structure.length > 0 ? this.formatMemoStructure(this.defaultMemoFields(), advancedSettings?.line_level_memo_structure) : this.defaultMemoFields(), Validators.required),
            topMemoStructure: new FormControl(advancedSettings?.top_level_memo_structure && advancedSettings?.top_level_memo_structure.length > 0 ? advancedSettings?.top_level_memo_structure : this.defaultTopMemoOptions(), Validators.required),
            exportSchedule: new FormControl(advancedSettings?.schedule_is_enabled || (isOnboarding && brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary) ? true : false),
            email: new FormControl(advancedSettings?.emails_selected ? advancedSettings?.emails_selected : null),
            exportScheduleFrequency: new FormControl(AdvancedSettingsModel.getExportFrequency(advancedSettings!.is_real_time_export_enabled, isOnboarding, advancedSettings!.schedule_is_enabled, advancedSettings!.interval_hours)),
            autoCreateReimbursableEnitity: new FormControl(advancedSettings?.auto_create_reimbursable_entity ? advancedSettings?.auto_create_reimbursable_entity : false),
            autoCreateMerchantsAsVendors: new FormControl(advancedSettings?.auto_create_merchant_as_vendor ? advancedSettings?.auto_create_merchant_as_vendor : false),
            skipExport: new FormControl(isSkipExportEnabled),
            searchOption: new FormControl('')
        });
    }

    static constructPayload (advancedSettingForm: FormGroup, adminEmails: EmailOption[]): QbdDirectAdvancedSettingsPost {
        const allSelectedEmails: EmailOption[] = advancedSettingForm.get('email')?.value;

        const selectedEmailsEmails = allSelectedEmails?.filter((email: EmailOption) => adminEmails.includes(email));

        const additionalEmails = allSelectedEmails?.filter((email: EmailOption) => !adminEmails.includes(email));

        const memo = advancedSettingForm.get('expenseMemoStructure')?.value ? advancedSettingForm.get('expenseMemoStructure')?.value : [];

        const advancedSettingPayload: QbdDirectAdvancedSettingsPost = {
            line_level_memo_structure: advancedSettingForm.get('expenseMemoStructure')?.value ? this.formatMemoStructure(this.defaultMemoFields(), memo) : [],
            top_level_memo_structure: advancedSettingForm.get('topMemoStructure')?.value ? advancedSettingForm.get('topMemoStructure')?.value : null,
            schedule_is_enabled: advancedSettingForm.get('exportSchedule')?.value ? advancedSettingForm.get('exportSchedule')?.value : false,
            emails_selected: advancedSettingForm.get('exportSchedule')?.value ? selectedEmailsEmails : [],
            interval_hours: advancedSettingForm.get('exportSchedule')?.value ? advancedSettingForm.get('exportScheduleFrequency')?.value : null,
            is_real_time_export_enabled: advancedSettingForm.get('exportScheduleFrequency')?.value === 0 ? true : false,
            auto_create_reimbursable_entity: advancedSettingForm.get('autoCreateReimbursableEnitity')?.value ? advancedSettingForm.get('autoCreateReimbursableEnitity')?.value : false,
            auto_create_merchant_as_vendor: advancedSettingForm.get('autoCreateMerchantsAsVendors')?.value ? advancedSettingForm.get('autoCreateMerchantsAsVendors')?.value : false,
            emails_added: advancedSettingForm.get('exportSchedule')?.value ? additionalEmails : []
        };

        return advancedSettingPayload;
    }
}

