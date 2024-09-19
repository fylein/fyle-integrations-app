import type { ExportMode } from "../../enum/enum.model";

export interface LastExport {
  id: number;
  last_exported_at: Date;
  next_export_at: Date;
  export_mode: ExportMode;
  total_expense_groups_count: number;
  successful_expense_groups_count: number;
  failed_expense_groups_count: number;
  workspace: number;
  created_at: Date;
  updated_at: Date;
}
