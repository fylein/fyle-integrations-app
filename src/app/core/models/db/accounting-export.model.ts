import { AccountingExportStatus, AccountingExportType } from "../enum/enum.model";
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
    response: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    exported_at: string;
    workspace: number;
    export_url: string;
}

export interface AccountingExportResponse extends PaginatedResponse {
    results: AccountingExportCreationType[];
}

export type AccountingExportGetParam = {
    type__in: AccountingExportType[],
    status__in: AccountingExportStatus[],
    id__in?: number[]
}