import { FormControl, FormGroup } from '@angular/forms';
import { ScheduleForm } from '../../misc/schedule-dialog.model';

export enum Sage50LineLevelMemoOption {
  PURPOSE = 'purpose',
  SPENT_AT = 'spent_at',
  MERCHANT = 'merchant',
  CARD_NUMBER = 'card_number',
  EMPLOYEE_NAME = 'employee_name',
  CARD_MERCHANT = 'card_merchant',
}

export enum Sage50TopLevelMemoOption {
  CARD_NUMBER = 'card_number',
  EMPLOYEE_NAME = 'employee_name',
}

export type Sage50AdvancedSettings = {
  schedule_is_enabled: boolean | null;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
  day_of_week: string | null; // "MONDAY"
  day_of_month: string | null; // 1-29 | 'L'
  time_of_day: string | null; // "17:30:00" (HH:MM:SS)
  line_level_memo_structure: Sage50LineLevelMemoOption[] | null;
  top_level_memo_structure: Sage50TopLevelMemoOption[] | null;
};

export interface Sage50AdvancedSettingsForm {
  isScheduleEnabled: FormControl<boolean>;
  schedule: FormGroup<ScheduleForm>;
  topLevelMemoStructure: FormControl<Sage50TopLevelMemoOption[] | []>;
  lineLevelMemoStructure: FormControl<Sage50LineLevelMemoOption[] | []>;
  isSkipExportEnabled: FormControl<boolean>;
}
