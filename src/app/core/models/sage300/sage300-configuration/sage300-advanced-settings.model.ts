import { FormControl, FormGroup } from "@angular/forms";
import { ConditionField, EmailOption, ExpenseFilterPost, ExpenseFilterResponse, ExpenseFilterPayload } from "../../common/advanced-settings.model";
import { JoinOption } from "../../enum/enum.model";
import { Sage300DestinationAttributes } from "../db/sage300-destination-attribuite.model";

export type AdvancedSettingValidatorRule = {
  condition1: string[];
  condition2: string[];
  operator1: string[];
  operator2: string[];
};

export type Sage300AdvancedSetting = {
  memo_structure: string[],
  default_job_name: string,
  default_job_id: string
  schedule_enabled: boolean,
  auto_create_vendor: boolean,
  intervel_hours: number
}

export interface Sage300AdvancedSettingGet extends Sage300AdvancedSetting {
  id: number,
  created_at: Date,
  update_at: Date,
  workspace: number
}

export interface Sage300AdvancedSettingPost extends Sage300AdvancedSetting { }

export class Sage300AdvancedSettingModel {

  static constructSkipExportPayload(valueField: ExpenseFilterPayload, valueOption1: any[]): ExpenseFilterPost {
    const op: string = (valueField.operator) as string;
    return {
      condition: valueField.condition.field_name,
      operator: valueField.operator,
      values:
        valueField.condition.type === 'DATE' ||
          valueField.operator === 'isnull' || valueField.condition.field_name === 'report_title' ? valueField.value : valueOption1,
      rank: valueField.rank,
      join_by: valueField?.join_by ? JoinOption[valueField.join_by as JoinOption] : null,
      is_custom: valueField.condition.is_custom,
      custom_field_type: valueField.condition?.is_custom ? valueField.condition.type : null
    };
  }

  static mapAPIResponseToFormGroup(advancedSettings: Sage300AdvancedSettingGet | null, isSkipExportEnabled: boolean, jobDestinationAttribute: Sage300DestinationAttributes[]): FormGroup {
    const findObjectByDestinationId = (array: Sage300DestinationAttributes[], id: string) => array?.find(item => item.destination_id === id) || null;
    return new FormGroup({
      memoStructure: new FormControl(advancedSettings?.memo_structure ? advancedSettings?.memo_structure : null),
      defaultJobName: new FormControl(advancedSettings?.default_job_name ? findObjectByDestinationId(jobDestinationAttribute, advancedSettings?.default_job_id) : null),
      scheduleEnabled: new FormControl(advancedSettings?.schedule_enabled ? true : false),
      autoCreateVendor: new FormControl(advancedSettings?.auto_create_vendor ? true : false),
      scheduleAutoExportFrequency: new FormControl(advancedSettings?.intervel_hours),
      skipExport: new FormControl(isSkipExportEnabled)
    });
  }

  static createAdvancedSettingPayload(advancedSettingsForm: FormGroup): Sage300AdvancedSettingPost {
    return {
      memo_structure: advancedSettingsForm.get('memo_structure')?.value ? advancedSettingsForm.get('memo_structure')?.value : null,
      default_job_name: advancedSettingsForm.get('default_job_name')?.value ? advancedSettingsForm.get('default_job_name')?.value.name : null,
      default_job_id: advancedSettingsForm.get('default_job_name')?.value ? advancedSettingsForm.get('default_job_name')?.value.destination_id : null,
      schedule_enabled: advancedSettingsForm.get('schedule_enabled')?.value ? advancedSettingsForm.get('schedule_enabled')?.value : false,
      intervel_hours: advancedSettingsForm.get('scheduleAutoExportFrequency')?.value ? advancedSettingsForm.get('scheduleAutoExportFrequency')?.value : null,
      auto_create_vendor: advancedSettingsForm.get('auto_create_vendor')?.value ? advancedSettingsForm.get('auto_create_vendor')?.value : false
    };
  }
}


