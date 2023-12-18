export interface AccountingExportSummary {
    id: number;
    last_exported_at: string;
    next_export_at: string;
    export_mode: string;
    total_accounting_export_count: number;
    successful_accounting_export_count: number;
    failed_accounting_export_count: number;
    created_at: string;
    updated_at: string;
    workspace: number;
}