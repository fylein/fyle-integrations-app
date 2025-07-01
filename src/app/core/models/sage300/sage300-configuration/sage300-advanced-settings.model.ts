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

