import { FormControl, FormGroup } from "@angular/forms";
import { ExpenseFilterPost, ExpenseFilterPayload, ConditionField } from "../../common/advanced-settings.model";
import { JoinOption, Operator } from "../../enum/enum.model";

export type Sage300AdvancedSetting = {
  memo_structure: string[],
  schedule_is_enabled: boolean,
  auto_create_vendor: boolean,
  interval_hours: number
}

export interface Sage300AdvancedSettingGet extends Sage300AdvancedSetting {
  id: number,
  created_at: Date,
  update_at: Date,
  workspace: number
}

export interface Sage300AdvancedSettingPost extends Sage300AdvancedSetting { }

export class Sage300AdvancedSettingModel {

  static mapAPIResponseToFormGroup(advancedSettings: Sage300AdvancedSettingGet | null, isSkipExportEnabled: boolean): FormGroup {
    const defaultMemoOptions: string[] = ['employee_email', 'employee_name','purpose', 'category', 'spent_on', 'report_number', 'expense_link', 'card_number'];
    return new FormGroup({
      memoStructure: new FormControl(advancedSettings?.memo_structure ? advancedSettings?.memo_structure : defaultMemoOptions),
      scheduleEnabled: new FormControl(advancedSettings?.schedule_is_enabled ? true : false),
      autoCreateVendor: new FormControl(advancedSettings?.auto_create_vendor ? true : false),
      scheduleAutoExportFrequency: new FormControl(advancedSettings?.interval_hours ? advancedSettings.interval_hours : 1),
      skipExport: new FormControl(isSkipExportEnabled)
    });
  }

  static createAdvancedSettingPayload(advancedSettingsForm: FormGroup): Sage300AdvancedSettingPost {
    return {
      memo_structure: advancedSettingsForm.get('memoStructure')?.value ? advancedSettingsForm.get('memoStructure')?.value : null,
      schedule_is_enabled: advancedSettingsForm.get('scheduleEnabled')?.value ? advancedSettingsForm.get('scheduleEnabled')?.value : false,
      interval_hours: advancedSettingsForm.get('scheduleEnabled')?.value ? advancedSettingsForm.get('scheduleAutoExportFrequency')?.value : null,
      auto_create_vendor: advancedSettingsForm.get('autoCreateVendor')?.value ? advancedSettingsForm.get('autoCreateVendor')?.value : false
    };
  }
}


