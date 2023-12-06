import { FormControl, FormGroup } from "@angular/forms";
import { ExpenseFilterPost, ExpenseFilterPayload, ConditionField } from "../../common/advanced-settings.model";
import { JoinOption, Operator } from "../../enum/enum.model";

export type AdvancedSettingValidatorRule = {
  condition1: string[];
  condition2: string[];
  operator1: string[];
  operator2: string[];
};

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

  static constructExportFilterPayload(valueField: any): ExpenseFilterPayload {
    return {
      condition: valueField['condition'+valueField.rank] as ConditionField,
      operator: valueField['operator'+valueField.rank] as Operator,
      value: valueField['value'+valueField.rank],
      join_by: valueField.join_by,
      rank: valueField.rank
    };
  }

  static constructSkipExportPayload(valueField: ExpenseFilterPayload, valueOption: any[]): ExpenseFilterPost {
    const op: string = (valueField.operator) as string;
    return {
      condition: valueField.condition.field_name,
      operator: valueField.operator,
      values:
        valueField.condition.type === 'DATE' ||
          valueField.operator === 'isnull' || valueField.condition.field_name === 'report_title' ? valueField.value : valueOption,
      rank: valueField.rank,
      join_by: valueField?.join_by ? JoinOption[valueField.join_by as JoinOption] : null,
      is_custom: valueField.condition.is_custom,
      custom_field_type: valueField.condition?.is_custom ? valueField.condition.type : null
    };
  }

  static mapAPIResponseToFormGroup(advancedSettings: Sage300AdvancedSettingGet | null, isSkipExportEnabled: boolean): FormGroup {
    const defaultMemoOptions: string[] = ['employee_email', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];
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


