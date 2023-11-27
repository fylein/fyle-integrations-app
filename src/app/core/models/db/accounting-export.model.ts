import { AccountingExportStatus, AccountingExportType } from "../enum/enum.model";
import { PaginatedResponse } from "./paginated-response.model";

export interface AccountingExportCount {
    count: number;
}

export interface AccountingExportList {
    index?: number;
    exportedAt: Date;
    employee: [string, string];
    expenseType?: 'Corporate Card' | 'Reimbursable';
    referenceNumber: string;
    exportedAs: string;
    integrationUrl?: string;
    fyleUrl?: string;
    fyleReferenceType?: string | null;
    expenses: any[];
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

export type AccountingExportGetParam = {
    type__in: AccountingExportType[],
    status__in: AccountingExportStatus[],
    id__in?: number[]
}