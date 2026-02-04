import { AbstractControl, FormControl, FormGroup } from "@angular/forms";

export type FrequencyOption = {
    label: string;
    value: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export type ScheduleForm = {
    frequency: FormControl<FrequencyOption['value'] | null>;
    dayOfWeek: FormControl<string | null>; // "MONDAY"
    dayOfMonth: FormControl<string | null>; // 1-29 | 'L'
    timeOfDay: FormControl<string | null>; // "17:30:00" (HH:MM:SS)
    meridiem: FormControl<'AM' | 'PM' | null>;
}

export type ScheduleDialogData = {
    form: FormGroup<ScheduleForm>;
}