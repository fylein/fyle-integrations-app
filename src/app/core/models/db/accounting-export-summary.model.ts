export interface AccountingExportSummary {
    id: number;
    last_exported_at: string;
    next_export_at: string;
    export_mode: string;
    total_export_log_count?: number;
    successful_export_log_count?: number;
    failed_export_log_count?: number;
    total_accounting_export_count: number;
    successful_accounting_export_count: number;
    failed_accounting_export_count: number;
    created_at: string;
    updated_at: string;
    workspace: number;
}

export class AccountingExportSummaryModel {
    static parseAPIResponseToAccountingSummary(response: any): AccountingExportSummary {
        return {
            id: response.id,
            last_exported_at: response.last_exported_at,
            next_export_at: response.next_export_at,
            export_mode: response.export_mode,
            total_accounting_export_count: response.total_expense_groups_count,
            successful_accounting_export_count: response.successful_expense_groups_count,
            failed_accounting_export_count: response.failed_expense_groups_count,
            created_at: response.created_at,
            updated_at: response.updated_at,
            workspace: response.workspace
        };
    }

    static parseAPIResponseToAccountingSummaryForQbdDirect(response: any): AccountingExportSummary {
        return {
            id: response.id,
            last_exported_at: response.last_exported_at,
            next_export_at: response.next_export_at,
            export_mode: response.export_mode,
            total_accounting_export_count: response.total_export_log_count,
            successful_accounting_export_count: response.successful_export_log_count,
            failed_accounting_export_count: response.failed_export_log_count,
            created_at: response.created_at,
            updated_at: response.updated_at,
            workspace: response.workspace
        };
    }
}
