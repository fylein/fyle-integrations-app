import { SnakeCaseToSpaceCasePipe } from "src/app/shared/pipes/snake-case-to-space-case.pipe";
import { AccountingExportStatus, AppName, FundSource, FyleReferenceType } from "../enum/enum.model";
import { ExpenseGroupDescription, SkipExportList, SkipExportLog } from "../intacct/db/expense-group.model";
import { Expense } from "../intacct/db/expense.model";
import { DateFilter } from "../qbd/misc/qbd-date-filter.model";
import { environment } from "src/environments/environment";
import { ExpenseGroup } from "./expense-group.model";
import { SentenceCasePipe } from "src/app/shared/pipes/sentence-case.pipe";
import { TranslocoService } from "@jsverse/transloco";

export interface AccountingExportCount {
    count: number;
}

export interface ExportableAccountingExport {
  exportable_accounting_export_ids: number[];
}

export interface AccountingExportList {
    exportedAt: Date;
    employee: [string, string];
    expenseType: string;
    referenceNumber: string;
    exportedAs: string;
    integrationUrl: string;
    fyleUrl: string;
    expenses: Expense[];
  }

export interface AccountingExport {
    id: number;
    type: string;
    description: ExpenseGroupDescription;
    status: AccountingExportStatus;
    mapping_errors: {
        type: string;
        value: string;
    }[] | null;
    response: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
    exported_at: Date;
    workspace: number;
    export_url: string;
    expenses: Expense[];
    fund_source: FundSource;
}

export type AccountingExportGetParam = {
    type__in?: string[],
    status__in: string[] | string,
    id__in?: number[],
    limit: number,
    offset: number,
    exported_at__lte?: string,
    exported_at__gte?: string,
    expenses__expense_number?: string;
    expenses__employee_name?: string;
    expenses__employee_email?: string;
    expenses__claim_number?: string;

}

// TODO: Move to Service

export class SkippedAccountingExportModel {
  static getfilteredSkippedAccountingExports(query: string, group: SkipExportList): boolean {
    query = query.toLowerCase().trim();
    const employeeName = group.employee ? group.employee[0] : '';
    const employeeID = group.employee ? group.employee[1] : '';
    const expenseType = group.expenseType ? group.expenseType : '';
    const referenceNumber = group.claim_number ? group.claim_number : '';

    return (
      employeeName.toLowerCase().includes(query) ||
      employeeID.toLowerCase().includes(query) ||
      expenseType.toLowerCase().includes(query) ||
      referenceNumber.toLowerCase().includes(query)
    );
  }

  static parseAPIResponseToSkipExportList(skippedExpense: SkipExportLog, org_id?: string): SkipExportList {
    return {
      updated_at: skippedExpense.updated_at,
      claim_number: skippedExpense.claim_number,
      employee: [skippedExpense.employee_name, skippedExpense.employee_email],
      expenseType: skippedExpense.fund_source === 'PERSONAL' ? 'Reimbursable' : 'Corporate Card',
      fyleUrl: `${environment.fyle_app_url}/app/admin/#/view_expense/${skippedExpense.expense_id}?org_id=${org_id}`
    };
  }
}
