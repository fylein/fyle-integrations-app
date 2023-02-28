import { FormGroup } from "@angular/forms";
import { QBDScheduleFrequency } from "../../enum/enum.model";

export type QBDEmailOption = {
    name: string,
    email: string
}
export type QBDAdvancedSettingsPost = {
    expense_memo_structure: string[],
    top_memo_structure: string[] | null,
    schedule_is_enabled: boolean,
    emails_selected: QBDEmailOption[],
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
    emails_selected: QBDEmailOption[],
    day_of_month: string | null,
    day_of_week: string | null,
    frequency: QBDScheduleFrequency | null,
    time_of_day: string | null,
    workspace: number
}

function getFrequencyTime(advancedSettingForm: FormGroup) {
    if (advancedSettingForm.get('frequency')?.value){
        const currentTime = +advancedSettingForm.controls.timeOfDay.value.slice(0, 2);
        const currentMins = advancedSettingForm.controls.timeOfDay.value.slice(3, 5);
        const currentDate = new Date(); // Create a new Date object with the current date and time in IST
        currentDate.setHours(20, 0, 0);
        if (advancedSettingForm.value.meridiem === 'PM' && currentTime !== 12) {
            currentDate.setHours(currentTime+12, currentMins, 0);
        } else if (advancedSettingForm.value.meridiem === 'PM' && currentTime === 12) {
            currentDate.setHours(currentTime, currentMins, 0);
        } else {
            if (currentTime === 12) {
                currentDate.setHours(0, currentMins, 0);
            } else if (currentTime > 9) {
                currentDate.setHours(currentTime, currentMins, 0);
            } else {
                currentDate.setHours(currentTime, currentMins, 0);
            }
        }
        return new Date(currentDate).toLocaleString('en-US', { timeZone: 'GMT', hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });
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
