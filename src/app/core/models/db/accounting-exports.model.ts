import { AccountingExportStatus } from "../enum/enum.model";

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

export interface AccountingExportCount {
    count: number;
}

export interface AccountingExportResult {
    id: number;
    type: string;
    status: AccountingExportStatus;
    mapping_errors: {
        type: string;
        value: string;
    }[] | null;
    sage_300_errors: {
        created_on: string;
        entity_id: string;
        error_msg: string;
        id: string;
        type_id: string;
        version: number;
    } | null;
    response: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    exported_at: string;
    workspace: number;
    purchase_invoice_id: null | number;
    export_url: string;
    direct_costs_id: null | number;
    sage_300_reimbursement: null | number;
}

export interface AccountingExportResponse {
    count: number;
    next: null | string;
    previous: null | string;
    results: AccountingExportResult[];
}
