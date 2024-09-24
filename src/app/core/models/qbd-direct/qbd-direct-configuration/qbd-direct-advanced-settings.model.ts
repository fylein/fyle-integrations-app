import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AdvancedSettingsModel, EmailOption } from "../../common/advanced-settings.model";

export type QbdDirectAdvancedSettingsPost = {
    expense_memo_structure: string[],
    top_memo_structure: string[] | null,
    schedule_is_enabled: boolean,
    emails_selected: EmailOption[],
    interval_hours: number
}

export interface QbdDirectAdvancedSettingsGet extends QbdDirectAdvancedSettingsPost {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace: number
}

export class QbdDirectAdvancedSettingsModel extends AdvancedSettingsModel {

    static defaultMemoFields(): string[] {
        return ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];
    }

    static defaultTopMemoOptions(): string[] {
        return ["employee_email", "employee_name", "purpose", "merchant"];
    }

    static mapAPIResponseToFormGroup(advancedSettings: QbdDirectAdvancedSettingsGet): FormGroup {

        return new FormGroup({
            expenseMemoStructure: new FormControl(advancedSettings?.expense_memo_structure && advancedSettings?.expense_memo_structure.length > 0 ? advancedSettings?.expense_memo_structure : this.defaultMemoFields(), Validators.required),
            topMemoStructure: new FormControl(advancedSettings?.top_memo_structure && advancedSettings?.top_memo_structure.length > 0 ? advancedSettings?.top_memo_structure[0] : this.defaultTopMemoOptions()[0], Validators.required),
            exportSchedule: new FormControl(advancedSettings?.schedule_is_enabled ? advancedSettings?.schedule_is_enabled : false),
            email: new FormControl(advancedSettings?.emails_selected.length > 0 ? advancedSettings?.emails_selected : []),
            exportScheduleFrequency: new FormControl(advancedSettings?.schedule_is_enabled ? advancedSettings?.interval_hours : 1),
            search: new FormControl(''),
            searchOption: new FormControl('')
        });
    }
}

