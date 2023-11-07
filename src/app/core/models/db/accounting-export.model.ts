import { AccountingExportStatus } from "../enum/enum.model";
import { PaginatedResponse } from "./paginated-response.model";

export interface AccountingExportCount {
    count: number;
}

export interface AccountingExportCreationType {
    id: number;
    type: string;
    status: AccountingExportStatus;
    expense_group: number;
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

export interface AccountingExportResponse extends PaginatedResponse {
    results: AccountingExportCreationType[];
}
