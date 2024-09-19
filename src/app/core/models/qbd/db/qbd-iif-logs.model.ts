export interface QBDAccountingExportsResult {
    id: number;
    type: string;
    fund_source: string;
    file_id: string | null,
    task_id: number | null,
    status: string,
    errors: string[] | null,
    created_at: Date,
    updated_at: Date,
    workspace: number
    download?: string
}

export interface QbdExportTriggerResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: QBDAccountingExportsResult[]
}

export interface QbdAccountingExportDownload {
    download_url: string;
    file_id: string;
    accounting_export_id: number;
    workspace_id: number;
}

export interface QbdExportTriggerGet {
    message: string;
    new_expenses_imported: boolean;
}
