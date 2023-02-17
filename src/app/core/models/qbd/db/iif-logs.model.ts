export type AccountingExportsResult = {
    id: number;
    type: string;
    file_id: string | null,
    task_id: number | null,
    status: string,
    errors: string[] | null,
    created_at: Date,
    updated_at: Date,
    workspace: number
    download?: string
}

export type QbdAccountingExportsGet = {
    count: number;
    next: string | null;
    previous: string | null;
    results: AccountingExportsResult[]
}

export type QbdAccountingExportsPost = {
    download_url: string;
    file_id: string;
    accounting_export_id: number;
    workspace_id: number;
}

export type GetQbdAccountingExportsPayload = {
    id: number;
    type: string;
    status: string;
}

export type QbdExportTriggerGet = {
    message: string;
}
