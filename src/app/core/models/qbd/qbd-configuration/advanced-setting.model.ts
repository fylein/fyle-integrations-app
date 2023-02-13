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

export class AdvancedSettingModel {
    static constructPayload(advancedSettingForm: FormGroup): QBDAdvancedSettingsPost {
        const topMemo: string[] = [];
        topMemo.push(advancedSettingForm.value.topMemoStructure);
        const currentTime = +advancedSettingForm.controls.timeOfDay.value.slice(0, 2);
        const currentMins = advancedSettingForm.controls.timeOfDay.value.slice(3, 5);
        let time = '';
        if (advancedSettingForm.value.meridiem === 'PM' && currentTime !== 12) {
            time = currentTime+12 + ":" + currentMins+":00";
          } else if (currentTime === 12) {
            time = "00:" + currentMins+":00";
          } else {
            time = currentTime + ":" + currentMins + ":00";
          }
        const advancedSettingPayload: QBDAdvancedSettingsPost = {
            expense_memo_structure: advancedSettingForm.get('expenseMemoStructure')?.value ? advancedSettingForm.get('expenseMemoStructure')?.value : null,
            top_memo_structure: advancedSettingForm.get('topMemoStructure')?.value ? topMemo : null,
            schedule_is_enabled: advancedSettingForm.get('exportSchedule')?.value ? advancedSettingForm.get('exportSchedule')?.value : false,
            emails_selected: advancedSettingForm.get('email')?.value ? advancedSettingForm.get('email')?.value : null,
            day_of_month: advancedSettingForm.get('dayOfMonth')?.value ? advancedSettingForm.get('dayOfMonth')?.value : null,
            day_of_week: advancedSettingForm.get('dayOfWeek')?.value ? time : null,
            frequency: advancedSettingForm.get('frequency')?.value ? advancedSettingForm.get('frequency')?.value : null,
            time_of_day: advancedSettingForm.get('timeOfDay')?.value ? advancedSettingForm.get('timeOfDay')?.value : null
        };
        return advancedSettingPayload;
    }
}