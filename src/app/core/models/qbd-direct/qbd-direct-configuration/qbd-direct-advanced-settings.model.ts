import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AdvancedSettingsModel, EmailOption } from "../../common/advanced-settings.model";
import { HelperUtility } from "../../common/helper.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { QBDScheduleFrequency } from "../../enum/enum.model";

export type QbdDirectAdvancedSettingsPost = {
    expense_memo_structure: string[],
    top_memo_structure: string[] | null,
    schedule_is_enabled: boolean,
    emails_selected: EmailOption[],
    day_of_month: string | null,
    day_of_week: string | null,
    frequency: QBDScheduleFrequency | null,
    time_of_day: string | null,
}

export interface QbdDirectAdvancedSettingsGet extends QbdDirectAdvancedSettingsPost {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace: number
}

export class QbdDirectAdvancedSettingsModel extends AdvancedSettingsModel {

    static frequencyOption(): SelectFormOption[] {
        return [
            {
                value: QBDScheduleFrequency.DAILY,
                label: 'Daily'
            },
            {
                value: QBDScheduleFrequency.WEEKLY,
                label: 'Weekly'
            },
            {
                value: QBDScheduleFrequency.MONTHLY,
                label: 'Monthly'
            }
        ];
    }

    static defaultMemoFields(): string[] {
        return ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];
    }

    static defaultTopMemoOptions(): string[] {
        return ["employee_email", "employee_name", "purpose", "merchant"];
    }

    static weeklyOptions(): string[] {
        return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    }

    static setFrequencyInterval(day: number): string {
        if (day === 1) {
          return day + ' st';
        } else if (day === 2) {
          return day + ' nd';
        } else if (day === 3) {
          return day + ' rd';
        }
        return day + ' th';
    }

    static frequencyIntervals():SelectFormOption[] {
        return [...Array(30).keys()].map(day => {
        return {
          label: this.setFrequencyInterval(day+1) + ' of every month',
          value: (day + 1).toString()
        };
      });
    }

    static initialTime(time_of_day: string | null): string[] {
        const inputTime = time_of_day ? time_of_day: "12:00:00";
        const outputTime = new Date(`01/01/2000 ${inputTime} GMT`).toLocaleString('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        });
        const time = outputTime.split(" ");
        const Time = time[0][0] > '1' && time[0][1] === ':' ? '0'+time[0] : time[0];
        time[0] = Time.slice(0, -3);
        return time;
    }

    static getFrequencyTime(advancedSettingForm: FormGroup) {
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

    static mapAPIResponseToFormGroup(advancedSettings: QbdDirectAdvancedSettingsGet): FormGroup {

        const resultTime = this.initialTime(advancedSettings?.time_of_day);
        return new FormGroup({
            expenseMemoStructure: new FormControl(advancedSettings?.expense_memo_structure && advancedSettings?.expense_memo_structure.length > 0 ? advancedSettings?.expense_memo_structure : this.defaultMemoFields(), Validators.required),
            topMemoStructure: new FormControl(advancedSettings?.top_memo_structure && advancedSettings?.top_memo_structure.length > 0 ? advancedSettings?.top_memo_structure[0] : this.defaultTopMemoOptions()[0], Validators.required),
            exportSchedule: new FormControl(advancedSettings?.schedule_is_enabled ? advancedSettings?.schedule_is_enabled : false),
            email: new FormControl(advancedSettings?.emails_selected.length > 0 ? advancedSettings?.emails_selected : []),
            frequency: new FormControl(advancedSettings?.frequency ? advancedSettings?.frequency : null),
            dayOfMonth: new FormControl(advancedSettings?.day_of_month ? advancedSettings?.day_of_month : null),
            dayOfWeek: new FormControl(advancedSettings?.day_of_week ? advancedSettings?.day_of_week : null),
            timeOfDay: new FormControl(resultTime[0]),
            meridiem: new FormControl(resultTime[1]),
            search: new FormControl(''),
            searchOption: new FormControl('')
        });
    }

    static constructPayload (advancedSettingForm: FormGroup): QbdDirectAdvancedSettingsPost {

        const topMemo: string[] = [];
        topMemo.push(advancedSettingForm.value.topMemoStructure);
        const time = this.getFrequencyTime(advancedSettingForm);

        const advancedSettingPayload: QbdDirectAdvancedSettingsPost = {
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

