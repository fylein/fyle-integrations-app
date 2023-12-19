import { SnakeCaseToSpaceCasePipe } from "src/app/shared/pipes/snake-case-to-space-case.pipe";
import { AccountingExportStatus, AccountingExportType, FundSource, FyleReferenceType } from "../enum/enum.model";
import { ExpenseGroupDescription, SkipExportList, SkipExportLog } from "../si/db/expense-group.model";
import { Expense } from "../si/db/expense.model";
import { TitleCasePipe } from "@angular/common";
import { ExportLogService } from "../../services/common/export-log.service";
import { DateFilter } from "../qbd/misc/date-filter.model";
import { environment } from "src/environments/environment";

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
    fund_source: FundSource;
}

export type AccountingExportGetParam = {
    type__in: string[],
    status__in: string[],
    id__in?: number[],
    limit: number,
    offset: number,
    exported_at__lte?: string,
    exported_at__gte?: string
}

export class AccountingExportModel {

  static getDateOptions(): DateFilter[] {
    const dateOptions: DateFilter[] = [
      {
        dateRange: 'This Month',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date()
      },
      {
        dateRange: 'This Week',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()),
        endDate: new Date()
      },
      {
        dateRange: 'Today',
        startDate: new Date(),
        endDate: new Date()
      },
      {
        dateRange: new Date().toLocaleDateString(),
        startDate: new Date(),
        endDate: new Date()
      }
    ];

    return dateOptions;
  }

  static getFyleExpenseUrl(expense_id: string): string {
    const url = `${environment.fyle_app_url}/app/admin/#/view_expense/${expense_id}`;
    return url;
  }

  static getfilteredAccountingExports(query: string, group: AccountingExportList): boolean {
    const employeeName = group.employee ? group.employee[0] : '';
    const employeeID = group.employee ? group.employee[1] : '';
    const expenseType = group.expenseType ? group.expenseType : '';
    const referenceNumber = group.referenceNumber ? group.referenceNumber : '';

    return (
      employeeName.toLowerCase().includes(query) ||
      employeeID.toLowerCase().includes(query) ||
      expenseType.toLowerCase().includes(query) ||
      referenceNumber.toLowerCase().includes(query)
    );
  }

  static getReferenceType(description: ExpenseGroupDescription): FyleReferenceType {
    let referenceType = FyleReferenceType.EXPENSE_REPORT;

    if (FyleReferenceType.EXPENSE in description) {
      referenceType = FyleReferenceType.EXPENSE;
    } else if (FyleReferenceType.EXPENSE_REPORT in description) {
      referenceType = FyleReferenceType.EXPENSE_REPORT;
    } else if (FyleReferenceType.PAYMENT in description) {
      referenceType = FyleReferenceType.PAYMENT;
    }

    return referenceType;
  }

  static formatExportType(exportType: string): string {
    if (exportType.startsWith('CREATING_')) {
      exportType = exportType.substring('CREATING_'.length);
    }
    exportType = new SnakeCaseToSpaceCasePipe().transform(exportType);
    return new TitleCasePipe().transform(exportType);
  }

  static getFyleReferenceNumber(referenceType: string, accountingExport: AccountingExport): string {
    if (referenceType === FyleReferenceType.EXPENSE) {
      return accountingExport.expenses[0].expense_number;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      return accountingExport.expenses[0].payment_number;
    } else if (referenceType === FyleReferenceType.EXPENSE_REPORT) {
      return accountingExport.expenses[0].claim_number;
    }
    return accountingExport.expenses[0].claim_number;
  }

  static parseAPIResponseToExportLog(accountingExport: AccountingExport, exportLogService: ExportLogService): AccountingExportList {
    const referenceType = AccountingExportModel.getReferenceType(accountingExport.description);
    const referenceNumber = this.getFyleReferenceNumber(referenceType, accountingExport);
    return {
      exportedAt: accountingExport.exported_at,
      employee: [accountingExport.expenses[0].employee_name, accountingExport.description.employee_email],
      expenseType: accountingExport.fund_source === FundSource.CCC ? FundSource.CORPORATE_CARD : FundSource.REIMBURSABLE,
      referenceNumber: referenceNumber,
      exportedAs: this.formatExportType(accountingExport.type),
      fyleUrl: exportLogService.generateFyleUrl(accountingExport, referenceType),
      integrationUrl: accountingExport.export_url,
      expenses: accountingExport.expenses
    };
  }
}

export class SkippedAccountingExportModel {
  static getfilteredSkippedAccountingExports(query: string, group: SkipExportList): boolean {
    const employeeID = group.employee ? group.employee[1] : '';
    const expenseType = group.expenseType ? group.expenseType : '';
    const referenceNumber = group.claim_number ? group.claim_number : '';

    return (
      employeeID.toLowerCase().includes(query) ||
      expenseType.toLowerCase().includes(query) ||
      referenceNumber.toLowerCase().includes(query)
    );
  }

  static parseAPIResponseToSkipExportList(skippedExpenses: SkipExportLog): SkipExportList {
    return {
      updated_at: skippedExpenses.updated_at,
      claim_number: skippedExpenses.claim_number,
      employee: [skippedExpenses.employee_name, skippedExpenses.employee_email],
      expenseType: skippedExpenses.fund_source === 'PERSONAL' ? 'Reimbursable' : 'Corporate Card',
      fyleUrl: `${environment.fyle_app_url}/app/admin/#/view_expense/${skippedExpenses.expense_id}`
    };
  }
}
