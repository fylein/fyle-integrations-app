import { AccountingExportCreationType } from "../../db/accounting-export.model";
import { PaginatedResponse } from "../../db/paginated-response.model";

export interface Sage300AccountingExport extends AccountingExportCreationType {
    sage_300_errors: any;
    purchase_invoice_id: null | number;
    direct_costs_id: null | number;
    sage_300_reimbursement: null | number;
}

export interface AccountingExportResponse extends PaginatedResponse {
    results: Sage300AccountingExport[];
}