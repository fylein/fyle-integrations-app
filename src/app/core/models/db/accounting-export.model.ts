import { SnakeCaseToSpaceCasePipe } from "src/app/shared/pipes/snake-case-to-space-case.pipe";
import { AccountingExportStatus, AccountingExportType, FundSource, FyleReferenceType } from "../enum/enum.model";
import { ExpenseGroupDescription } from "../si/db/expense-group.model";
import { Expense } from "../si/db/expense.model";
import { TitleCasePipe } from "@angular/common";
import { ExportLogService } from "../../services/common/export-log.service";

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
    type__in: AccountingExportType[],
    status__in: AccountingExportStatus[],
    id__in?: number[],
    limit?: number,
    offset?: number,
    exported_at__lte?: string,
    exported_at__gte?: string
}

export class AccountingExportUtils {
  static formatExportedAs(exportType: string): string {
    if (exportType.startsWith('CREATING_')) {
      exportType = exportType.substring('CREATING_'.length);
    }
    exportType = new SnakeCaseToSpaceCasePipe().transform(exportType);
    return new TitleCasePipe().transform(exportType);
  }

  static getReferenceNumber(referenceType: string, accountingExport: AccountingExport): string {
    if (referenceType === FyleReferenceType.EXPENSE) {
      return accountingExport.expenses[0].expense_number;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      return accountingExport.expenses[0].payment_number;
    }
    return '';
  }

  static createAccountingExport(accountingExport: AccountingExport, exportLogService: ExportLogService): AccountingExportList {
    const referenceType = exportLogService.getReferenceType(accountingExport.description);
    const referenceNumber = this.getReferenceNumber(referenceType, accountingExport);

    return {
      exportedAt: accountingExport.exported_at,
      employee: [accountingExport.expenses[0].employee_name, accountingExport.description.employee_email],
      expenseType: accountingExport.fund_source === FundSource.CCC ? FundSource.CORPORATE_CARD : FundSource.REIMBURSABLE,
      referenceNumber: referenceNumber,
      exportedAs: this.formatExportedAs(accountingExport.type),
      fyleUrl: exportLogService.generateFyleUrl(accountingExport, referenceType),
      integrationUrl: accountingExport.export_url,
      expenses: accountingExport.expenses
    };
  }
}
