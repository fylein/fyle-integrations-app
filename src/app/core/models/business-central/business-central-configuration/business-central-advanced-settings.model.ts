import { FormControl, FormGroup } from '@angular/forms';
import { ConditionField, ExpenseFilterPayload, ExpenseFilterPost } from '../../common/advanced-settings.model';
import { JoinOption, Operator } from '../../enum/enum.model';

export type BusinessCentralAdvancedSettings = {
  top_memo_structure: string[];
  expense_memo_structure: string[];
  schedule_is_enabled: boolean;
  interval_hours: number;
};

export interface BusinessCentralAdvancedSettingsGet extends BusinessCentralAdvancedSettings {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}

export interface BusinessCentralAdvancedSettingsPost extends BusinessCentralAdvancedSettings {}

export class BusinessCentralAdvancedSettingsModel {
  static mapAPIResponseToFormGroup(
    advancedSettings: BusinessCentralAdvancedSettingsGet | null,
    isSkipExportEnabled: boolean,
  ): FormGroup {
    const defaultMemoOptions: string[] = [
      'employee_email',
      'purpose',
      'category',
      'spent_on',
      'report_number',
      'expense_link',
    ];
    return new FormGroup({
      memoStructure: new FormControl(
        advancedSettings?.expense_memo_structure ? advancedSettings?.expense_memo_structure : defaultMemoOptions,
      ),
      scheduleEnabled: new FormControl(advancedSettings?.schedule_is_enabled ? true : false),
      scheduleAutoExportFrequency: new FormControl(
        advancedSettings?.interval_hours ? advancedSettings.interval_hours : 1,
      ),
      topMemo: new FormControl(
        advancedSettings?.top_memo_structure ? advancedSettings?.top_memo_structure : defaultMemoOptions[0],
      ),
      skipExport: new FormControl(isSkipExportEnabled),
    });
  }

  static createAdvancedSettingPayload(advancedSettingsForm: FormGroup): BusinessCentralAdvancedSettingsPost {
    return {
      top_memo_structure: advancedSettingsForm.get('topMemo')?.value
        ? advancedSettingsForm.get('topMemo')?.value
        : null,
      expense_memo_structure: advancedSettingsForm.get('memoStructure')?.value
        ? advancedSettingsForm.get('memoStructure')?.value
        : null,
      schedule_is_enabled: advancedSettingsForm.get('scheduleEnabled')?.value
        ? advancedSettingsForm.get('scheduleEnabled')?.value
        : false,
      interval_hours: advancedSettingsForm.get('scheduleEnabled')?.value
        ? advancedSettingsForm.get('scheduleAutoExportFrequency')?.value
        : null,
    };
  }
}
