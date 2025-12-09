import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FrequencyOption, ScheduleForm } from '../../models/misc/schedule-dialog.model';
import { TranslocoService } from '@jsverse/transloco';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SelectFormOption } from '../../models/common/select-form-option.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleFormService {
  constructor(private translocoService: TranslocoService) {}

  getFrequencyOptions(): FrequencyOption[] {
    return [
      {
        label: 'Daily',
        value: 'DAILY',
      },
      {
        label: 'Weekly',
        value: 'WEEKLY',
      },
      {
        label: 'Monthly',
        value: 'MONTHLY',
      },
    ];
  }

  getDayOfWeekOptions(): SelectFormOption[] {
    const weekdayOptionValues = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return weekdayOptionValues.map((value) => ({
      label: new SentenceCasePipe(this.translocoService).transform(value),
      value: value,
    }));
  }

  getDayOfMonthOptions(): SelectFormOption[] {
    const dayOfMonthOptions = [];
    for (let i = 1; i <= 28; i++) {
      const suffix = i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th';
      dayOfMonthOptions.push({
        label: `${i}${suffix} of every month`,
        value: `${i}`,
      });
    }
    dayOfMonthOptions.push({
      label: 'Last day of every month',
      value: 'L',
    });

    return dayOfMonthOptions;
  }

  getTimeOptions(): string[] {
    const timeOptions = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (const minute of ['00', '30']) {
        const paddedHour = hour.toString().padStart(2, '0'); // 01, 02, 03, ..., 12
        timeOptions.push(`${paddedHour}:${minute}`); // 01:00, 01:30, ..., 12:30
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
      (option) => option.value === form.get('dayOfMonth')?.value!,
    )?.label!;
    const timeOfDay = form.get('timeOfDay')?.value!;
    const meridiem = form.get('meridiem')?.value!;

    const translationKey = {
      DAILY: 'services.scheduleForm.dailySchedulePreview',
      WEEKLY: 'services.scheduleForm.weeklySchedulePreview',
      MONTHLY: 'services.scheduleForm.monthlySchedulePreview',
    }[frequency];

    return this.translocoService.translate(translationKey, { frequency, dayOfWeek, dayOfMonth, timeOfDay, meridiem });
  }

  /**
   * Converts UTC time of format HH:MM:SS to local timeOfDay (HH:MM) and meridiem
   */
  getLocalTimeOfDay(UTCTimeOfDay: string | null): { timeOfDay: string | null; meridiem: 'AM' | 'PM' } {
    if (!UTCTimeOfDay) {
      return {
        timeOfDay: null,
        meridiem: 'AM',
      };
    }
    const localTimeOfDay = new Date(`01/01/2000 ${UTCTimeOfDay}Z`);

    let hours = localTimeOfDay.getHours();
    const meridiem = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const hoursString = hours.toString().padStart(2, '0');

    const minutesString = localTimeOfDay.getMinutes().toString().padStart(2, '0');

    return {
      timeOfDay: `${hoursString}:${minutesString}`,
      meridiem: meridiem,
    };
  }

  /**
   * Given a schedule form, converts local timeOfDay and meridiem to UTC time of format HH:MM:SS
   */
  getUTCTimeOfDay(schedule: FormGroup<ScheduleForm>): string | null {
    const timeOfDay = schedule.get('timeOfDay')?.value ?? null;
    const meridiem = schedule.get('meridiem')?.value ?? 'AM';

    let timeOfDayUTC = null;

    if (timeOfDay && meridiem) {
      // Local time
      const date = new Date(`01/01/2000 ${timeOfDay} ${meridiem}`);

      // Convert to UTC HH:MM:SS format
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      timeOfDayUTC = `${hours}:${minutes}:00`;
    }

    return timeOfDayUTC;
  }
}
