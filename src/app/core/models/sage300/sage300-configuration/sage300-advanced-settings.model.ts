import { FormControl, FormGroup } from "@angular/forms";
import { brandingFeatureConfig } from "src/app/branding/branding-config";
import { AdvancedSettingsService } from "src/app/core/services/common/advanced-settings.service";

export type Sage300AdvancedSetting = {
  expense_memo_structure: string[],
  schedule_is_enabled: boolean,
  auto_create_vendor: boolean,
  interval_hours: number
  is_real_time_export_enabled: boolean
}

export interface Sage300AdvancedSettingGet extends Sage300AdvancedSetting {
  id: number,
  created_at: Date,
  update_at: Date,
  workspace: number
}

export interface Sage300AdvancedSettingPost extends Sage300AdvancedSetting { }

export class Sage300AdvancedSettingModel {

  static mapAPIResponseToFormGroup(advancedSettings: Sage300AdvancedSettingGet | null, isSkipExportEnabled: boolean, isOnboarding: boolean): FormGroup {
    const defaultMemoOptions: string[] = ['employee_email', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];
    return new FormGroup({
      memoStructure: new FormControl(advancedSettings?.expense_memo_structure ? advancedSettings?.expense_memo_structure : defaultMemoOptions),
      scheduleEnabled: new FormControl(advancedSettings?.schedule_is_enabled || (isOnboarding && brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary) ? true : false),
      autoCreateVendor: new FormControl(advancedSettings?.auto_create_vendor ? true : false),
      scheduleAutoExportFrequency: new FormControl(AdvancedSettingsService.getExportFrequency(advancedSettings?.is_real_time_export_enabled, isOnboarding, advancedSettings?.schedule_is_enabled, advancedSettings?.interval_hours)),
      skipExport: new FormControl(isSkipExportEnabled)
    });
  }

  static createAdvancedSettingPayload(advancedSettingsForm: FormGroup): Sage300AdvancedSettingPost {
    return {
      expense_memo_structure: advancedSettingsForm.get('memoStructure')?.value ? advancedSettingsForm.get('memoStructure')?.value : null,
      schedule_is_enabled: advancedSettingsForm.get('scheduleEnabled')?.value ? advancedSettingsForm.get('scheduleEnabled')?.value : false,
      interval_hours: advancedSettingsForm.get('scheduleEnabled')?.value ? advancedSettingsForm.get('scheduleAutoExportFrequency')?.value : null,
      auto_create_vendor: advancedSettingsForm.get('autoCreateVendor')?.value ? advancedSettingsForm.get('autoCreateVendor')?.value : false,
      is_real_time_export_enabled: advancedSettingsForm.get('scheduleEnabled')?.value && advancedSettingsForm.get('scheduleAutoExportFrequency')?.value === 0 ? true : false
    };
  }
}


