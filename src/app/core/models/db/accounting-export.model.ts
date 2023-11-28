import { AccountingExportStatus, AccountingExportType } from "../enum/enum.model";
import { ExpenseGroupDescription } from "../si/db/expense-group.model";
import { Expense } from "../si/db/expense.model";

export interface AccountingExportCount {
    count: number;
}

export interface AccountingExportList {
    exportedAt: Date;
    employee: [string, string];
    expenseType: string;
    referenceNumber: string;
    exportedAs: string;
    integrationUrl: string;
    fyleUrl: string;
    fyleReferenceType: string;
    expenses: Expense[];
  }

export interface AccountingExportCreationType {
    id: number;
    type: string;
    description: ExpenseGroupDescription;
    status: AccountingExportStatus;
    expense_group: number;
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
    fund_source: string;
}

// enum for fund_source PERSONAL CCC
//  remove creationType from model name

export type AccountingExportGetParam = {
    type__in: AccountingExportType[],
    status__in: AccountingExportStatus[],
    id__in?: number[]
}