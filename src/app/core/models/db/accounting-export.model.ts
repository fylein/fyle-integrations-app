import { SnakeCaseToSpaceCasePipe } from "src/app/shared/pipes/snake-case-to-space-case.pipe";
import { AccountingExportStatus, AccountingExportType, AppName, FundSource, FyleReferenceType } from "../enum/enum.model";
import { ExpenseGroupDescription, SkipExportList, SkipExportLog } from "../intacct/db/expense-group.model";
import { Expense } from "../intacct/db/expense.model";
import { TitleCasePipe } from "@angular/common";
import { ExportLogService } from "../../services/common/export-log.service";
import { DateFilter } from "../qbd/misc/date-filter.model";
import { environment } from "src/environments/environment";
import { ExpenseGroup } from "./expense-group.model";

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
    type__in: string[],
    status__in: string[],
    id__in?: number[],
    limit: number,
    offset: number,
    exported_at__lte?: string,
    exported_at__gte?: string
}

export class AccountingExportModel {
  static getDateOptionsV2(): DateFilter[] {
    const currentDateTime = new Date();
    const dateOptions: DateFilter[] = [
      {
        dateRange: 'This Week',
        startDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - currentDateTime.getDay()),
        endDate: currentDateTime
      },
      {
        dateRange: 'Last Week',
        startDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - currentDateTime.getDay() - 7),
        endDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - currentDateTime.getDay() - 1)
      },
      {
        dateRange: 'This Month',
        startDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), 1),
        endDate: currentDateTime
      },
      {
        dateRange: 'Last Month',
        startDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() - 1, 1),
        endDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), 0)
      }
    ];

    return dateOptions;
  }

  static getFyleExpenseUrl(expense_id: string): string {
    const url = `${environment.fyle_app_url}/app/admin/#/view_expense/${expense_id}`;
    return url;
  }

  static getfilteredAccountingExports(query: string, group: AccountingExportList): boolean {
    query = query.toLowerCase().trim();
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
    let referenceType = FyleReferenceType.REPORT_ID;

    if (FyleReferenceType.EXPENSE in description) {
      referenceType = FyleReferenceType.EXPENSE;
    } else if (FyleReferenceType.REPORT_ID in description) {
      referenceType = FyleReferenceType.REPORT_ID;
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

  static getFyleReferenceNumber(referenceType: string, expense: Expense): string {
    if (referenceType === FyleReferenceType.EXPENSE) {
      return expense.expense_number;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      return expense.payment_number;
    } else if (referenceType === FyleReferenceType.REPORT_ID) {
      return expense.claim_number;
    }
    return expense.claim_number;
  }

  static generateFyleUrl(expense: Expense, referenceType: FyleReferenceType, org_id: string) : string {
    let url = `${environment.fyle_app_url}/app/`;
    if (referenceType === FyleReferenceType.EXPENSE) {
      url += `admin/#/view_expense/${expense.expense_id}`;
    } else if (referenceType === FyleReferenceType.REPORT_ID) {
      url += `admin/#/reports/${expense.report_id}`;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      url += `admin/#/settlements/${expense.settlement_id}`;
    }
    return `${url}?org_id=${org_id}`;
  }

  static parseAPIResponseToExportLog(accountingExport: AccountingExport, org_id: string): AccountingExportList {
    const referenceType = AccountingExportModel.getReferenceType(accountingExport.description);
    const referenceNumber = this.getFyleReferenceNumber(referenceType, accountingExport.expenses[0]);
    return {
      exportedAt: accountingExport.exported_at,
      employee: [accountingExport.expenses[0].employee_name, accountingExport.description.employee_email],
      expenseType: accountingExport.fund_source === FundSource.CCC ? FundSource.CORPORATE_CARD : FundSource.REIMBURSABLE,
      referenceNumber: referenceNumber,
      exportedAs: this.formatExportType(accountingExport.type),
      fyleUrl: this.generateFyleUrl(accountingExport.expenses[0], referenceType, org_id),
      integrationUrl: accountingExport.export_url,
      expenses: accountingExport.expenses
    };
  }

  static generateExportTypeAndId(expenseGroup: ExpenseGroup) {
    if (!expenseGroup.response_logs) {
      return [null, null, null];
    }
    let exportRedirection = null;
    let exportType = null;
    let exportId = null;

    if ('Bill' in expenseGroup.response_logs && expenseGroup.response_logs.Bill) {
      exportRedirection = 'bill';
      exportType = exportRedirection;
      exportId = expenseGroup.response_logs.Bill.Id;
    } else if ('JournalEntry' in expenseGroup.response_logs && expenseGroup.response_logs.JournalEntry) {
      exportRedirection = 'journal';
      exportType = 'Journal Entry';
      exportId = expenseGroup.response_logs.JournalEntry.Id;
    } else if ('Purchase' in expenseGroup.response_logs && expenseGroup.response_logs.Purchase) {
      exportId = expenseGroup.response_logs.Purchase.Id;
      if (expenseGroup.response_logs.Purchase.PaymentType === 'Check') {
        exportRedirection = 'check';
        exportType = exportRedirection;
      } else {
        exportRedirection = 'expense';
        if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && !expenseGroup.response_logs.Purchase.Credit) {
          exportType = 'Credit Card Purchase';
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && expenseGroup.response_logs.Purchase.Credit) {
          exportType = 'Credit Card Credit';
          exportRedirection = 'creditcardcredit';
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'Cash') {
          exportType = 'Debit Card Expense';
          exportRedirection = 'expense';
        } else {
          exportType = 'expense';
        }
      }
    }

    return [exportRedirection, exportId, exportType];
  }

  static parseExpenseGroupAPIResponseToExportLog(expenseGroup: ExpenseGroup, org_id: string, app_name: AppName): AccountingExportList {
    if(app_name===AppName.QBO) {
      const referenceType = AccountingExportModel.getReferenceType(expenseGroup.description);
      const referenceNumber = this.getFyleReferenceNumber(referenceType, expenseGroup.expenses[0]);
  
      const [type, id, exportType] = this.generateExportTypeAndId(expenseGroup);
  
      return {
        exportedAt: expenseGroup.exported_at,
        employee: [expenseGroup.expenses[0].employee_name, expenseGroup.description.employee_email],
        expenseType: expenseGroup.fund_source === FundSource.CCC ? FundSource.CORPORATE_CARD : FundSource.REIMBURSABLE,
        referenceNumber: referenceNumber,
        exportedAs: exportType,
        fyleUrl: this.generateFyleUrl(expenseGroup.expenses[0], referenceType, org_id),
        integrationUrl: `${environment.qbo_app_url}/app/${type}?txnId=${id}`,
        expenses: expenseGroup.expenses
      };
    } else if (app_name===AppName.INTACCT) {
      const referenceType = AccountingExportModel.getReferenceType(expenseGroup.description);
      const referenceNumber = this.getFyleReferenceNumber(referenceType, expenseGroup.expenses[0]);

      const [type, id, exportType] = this.generateExportTypeAndId(expenseGroup);

      return {
        exportedAt: expenseGroup.exported_at,
        employee: [expenseGroup.employee_name, expenseGroup.description.employee_email],
        expenseType: expenseGroup.fund_source === 'CCC' ? 'Corporate Card' : 'Reimbursable',
        referenceNumber: referenceNumber,
        exportedAs: exportType,
        fyleUrl: this.generateFyleUrl(expenseGroup.expenses[0], referenceType, org_id),
        integrationUrl: `https://www-p02.intacct.com/ia/acct/ur.phtml?.r=${expenseGroup.response_logs?.url_id}`,
        expenses: expenseGroup.expenses
      };
    }

    return {} as AccountingExportList;
  }
}

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

  static parseAPIResponseToSkipExportList(skippedExpense: SkipExportLog): SkipExportList {
    return {
      updated_at: skippedExpense.updated_at,
      claim_number: skippedExpense.claim_number,
      employee: [skippedExpense.employee_name, skippedExpense.employee_email],
      expenseType: skippedExpense.fund_source === 'PERSONAL' ? 'Reimbursable' : 'Corporate Card',
      fyleUrl: `${environment.fyle_app_url}/app/admin/#/view_expense/${skippedExpense.expense_id}?org_id=${skippedExpense.org_id}`
    };
  }
}
