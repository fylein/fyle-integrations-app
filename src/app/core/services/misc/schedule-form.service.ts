import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FrequencyOption, ScheduleForm } from '../../models/misc/schedule-dialog.model';
import { TranslocoService } from '@jsverse/transloco';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SelectFormOption } from '../../models/common/select-form-option.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleFormService {

  constructor(
    private translocoService: TranslocoService
  ) { }

  getFrequencyOptions(): FrequencyOption[] {
    return [
      {
        label: 'Daily',
        value: 'DAILY'
      },
      {
        label: 'Weekly',
        value: 'WEEKLY'
      },
      {
        label: 'Monthly',
        value: 'MONTHLY'
      }
    ];
  }

  getDayOfWeekOptions(): SelectFormOption[] {
    const weekdayOptionValues = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return weekdayOptionValues.map(value => ({
      label: new SentenceCasePipe(this.translocoService).transform(value),
      value: value
    }));
  }

  getDayOfMonthOptions(): SelectFormOption[] {
    const dayOfMonthOptions = [];
    for (let i = 1; i <= 28; i++) {
      const suffix = i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th';
      dayOfMonthOptions.push({
        label: `${i}${suffix} of every month`,
        value: `${i}`
      });
    }
    dayOfMonthOptions.push({
      label: 'Last day of every month',
      value: 'L'
    });

    return dayOfMonthOptions;
  }


  getTimeOptions(is24HourTimeFormat: boolean): string[] {
    const timeOptions = [];
    if (is24HourTimeFormat) {
      for (let hour = 0; hour < 24; hour++) {
        for (const minute of ['00', '30']) {
          const paddedHour = hour.toString().padStart(2, '0'); // 00, 01, 02, ..., 23
          timeOptions.push(`${paddedHour}:${minute}`); // 00:00, 00:30, 01:00, ..., 23:30
        }
      }
    } else {
      for (let hour = 1; hour <= 12; hour++) {
        for (const minute of ['00', '30']) {
          const paddedHour = hour.toString().padStart(2, '0'); // 01, 02, 03, ..., 12
          timeOptions.push(`${paddedHour}:${minute}`); // 01:00, 01:30, ..., 12:30
        }
      }
    }
    return timeOptions;
  }

  getSchedulePreview(form: FormGroup<ScheduleForm>) {
    if (!form?.valid) {
      return null;
    }

    const frequency = form.get('frequency')?.value!;
    const dayOfWeek = new SentenceCasePipe(this.translocoService).transform(form.get('dayOfWeek')?.value!);
    const dayOfMonth = this.getDayOfMonthOptions().find(
      option => option.value === form.get('dayOfMonth')?.value!
    )?.label!;
    const timeOfDay = form.get('timeOfDay')?.value!;
    const meridiem = form.get('meridiem')?.value!;

    const translationKey = {
      'DAILY': 'services.scheduleForm.dailySchedulePreview',
      'WEEKLY': 'services.scheduleForm.weeklySchedulePreview',
      'MONTHLY': 'services.scheduleForm.monthlySchedulePreview'
    }[frequency];

    return this.translocoService.translate(translationKey, { frequency, dayOfWeek, dayOfMonth, timeOfDay, meridiem });
  }

  /**
   * Converts UTC time of format HH:MM:SS to local timeOfDay (HH:MM) and meridiem
   */
  getLocalTimeOfDay(
    UTCTimeOfDay: string | null, is24HourTimeFormat: boolean
  ): { timeOfDay: string | null, meridiem: 'AM' | 'PM' | null } {
    if (!UTCTimeOfDay) {
      return {
        timeOfDay: null,
        meridiem: 'AM'
      };
    }
    const localTimeOfDay = new Date(`01/01/2000 ${UTCTimeOfDay}Z`);

    let hours = localTimeOfDay.getHours();
    let meridiem: 'AM' | 'PM' | null = null;

    if (!is24HourTimeFormat) {
      meridiem = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // The hour '0' should be '12'
    }
    const hoursString = hours.toString().padStart(2, '0');

    const minutesString = localTimeOfDay.getMinutes().toString().padStart(2, '0');

    return {
      timeOfDay: `${hoursString}:${minutesString}`,
      meridiem: meridiem
    };
  }

  /**
   * Given a schedule form, converts local timeOfDay and meridiem to UTC time of format HH:MM:SS
   */
  getUTCTimeOfDay(schedule: FormGroup<ScheduleForm>, is24HourTimeFormat: boolean): string | null {
    const timeOfDay = schedule.get('timeOfDay')?.value ?? null;
    const meridiem = schedule.get('meridiem')?.value ?? 'AM';

    let timeOfDayUTC = null;

    if (timeOfDay && (is24HourTimeFormat || meridiem)) {
        // Local time
        const dateString = is24HourTimeFormat ? `01/01/2000 ${timeOfDay}` : `01/01/2000 ${timeOfDay} ${meridiem}`;
        const date = new Date(dateString);

        // Convert to UTC HH:MM:SS format
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        timeOfDayUTC = `${hours}:${minutes}:00`;
    }

    return timeOfDayUTC;
  }
}
