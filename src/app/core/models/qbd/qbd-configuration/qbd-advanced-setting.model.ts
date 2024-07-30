import { FormGroup } from "@angular/forms";
import { QBDScheduleFrequency } from "../../enum/enum.model";

export type EmailOptions = {
    name: string,
    email: string
}

export type QBDAdvancedSettingsPost = {
    expense_memo_structure: string[],
    top_memo_structure: string[] | null,
    schedule_is_enabled: boolean,
    emails_selected: EmailOptions[],
    day_of_month: string | null,
    day_of_week: string | null,
    frequency: QBDScheduleFrequency | null,
    time_of_day: string | null,
}

export type QBDAdvancedSettingsGet = {
    id: number,
    created_at: Date,
    updated_at: Date,
    expense_memo_structure: string[],
    top_memo_structure: string[],
    schedule_is_enabled: boolean,
    schedule_id: number | null,
    emails_selected: EmailOptions[],
    day_of_month: string | null,
    day_of_week: string | null,
    frequency: QBDScheduleFrequency | null,
    time_of_day: string | null,
    workspace: number
}

function getFrequencyTime(advancedSettingForm: FormGroup) {
    if (advancedSettingForm.get('frequency')?.value){
        const currentDate = `${advancedSettingForm.controls.timeOfDay.value} ${advancedSettingForm.controls.meridiem.value}`; // Create a new Date object with the Export Date and time in IST
        const date = new Date(`01/01/2000 ${currentDate}`);

        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();

        // Convert the hours to a 2-digit string
        const hour = hours.toString().padStart(2, '0');
        const minute = minutes.toString().padStart(2, '0');
        // Create the 24-hour GMT time string
        const gmtTime24 = `${hour}:${minute}:00`;
        return gmtTime24;
    }
    return null;
}

export class AdvancedSettingModel {
    static constructPayload(advancedSettingForm: FormGroup): QBDAdvancedSettingsPost {
        const topMemo: string[] = [];
        topMemo.push(advancedSettingForm.value.topMemoStructure);
        const time = getFrequencyTime(advancedSettingForm);
        const advancedSettingPayload: QBDAdvancedSettingsPost = {
            expense_memo_structure: advancedSettingForm.get('expenseMemoStructure')?.value ? advancedSettingForm.get('expenseMemoStructure')?.value : null,
            top_memo_structure: advancedSettingForm.get('topMemoStructure')?.value ? topMemo : null,
            schedule_is_enabled: advancedSettingForm.get('exportSchedule')?.value ? advancedSettingForm.get('exportSchedule')?.value : false,
            emails_selected: advancedSettingForm.get('email')?.value ? advancedSettingForm.get('email')?.value : null,
            day_of_month: advancedSettingForm.get('dayOfMonth')?.value ? advancedSettingForm.get('dayOfMonth')?.value : null,
            day_of_week: advancedSettingForm.get('dayOfWeek')?.value ? advancedSettingForm.get('dayOfWeek')?.value : null,
            frequency: advancedSettingForm.get('frequency')?.value ? advancedSettingForm.get('frequency')?.value : null,
            time_of_day: advancedSettingForm.get('frequency')?.value ? time : null
        };
        return advancedSettingPayload;
    }
}
