export interface AccountingExportSummary {
    id: number;
    last_exported_at: string;
    next_export_at: string;
    export_mode: string;
    total_expense_groups_count: number;
    successful_expense_groups_count: number;
    failed_expense_groups_count: number;
    created_at: string;
    updated_at: string;
    workspace: number;
}