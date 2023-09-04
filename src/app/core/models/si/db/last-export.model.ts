import { ExportMode } from "../../enum/enum.model";

export type LastExport = {
  last_exported_at: Date;
  export_mode: ExportMode;
  total_expense_groups_count: number;
  successful_expense_groups_count: number;
  failed_expense_groups_count: number;
  workspace: number;
  created_at: Date;
  updated_at: Date;
  id?: number;
};
