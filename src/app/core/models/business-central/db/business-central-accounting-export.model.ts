import { AccountingExport } from '../../db/accounting-export.model';
import { PaginatedResponse } from '../../db/paginated-response.model';

export interface BusinessCentralAccountingExport extends AccountingExport {
  business_central_errors: any;
  purchase_invoice_id: null | number;
  journal_entry_id: null | number;
  business_central_reimbursement: null | number;
}

export interface BusinessCentralAccountingExportResponse extends PaginatedResponse {
  results: BusinessCentralAccountingExport[];
}
