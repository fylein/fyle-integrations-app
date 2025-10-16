import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountingExportStatus, AccountingExportType, AppName } from '../../models/enum/enum.model';
import { AccountingExportSummary } from '../../models/db/accounting-export-summary.model';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';
import { HelperService } from './helper.service';
import { AccountingExportCount, AccountingExportGetParam } from '../../models/db/accounting-export.model';
import { SelectedDateFilter } from '../../models/qbd/misc/qbd-date-filter.model';
import { Cacheable } from 'ts-cacheable';
import { DateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { FyleReferenceType } from 'src/app/core/models/enum/enum.model';
import { FundSource } from 'src/app/core/models/enum/enum.model';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { AccountingExport } from 'src/app/core/models/db/accounting-export.model';
import { Expense } from "../../models/intacct/db/expense.model";
import { TranslocoService } from '@jsverse/transloco';
import { environment } from 'src/environments/environment';
import { AccountingExportList } from '../../models/db/accounting-export.model';
import { ExpenseGroup, ExpenseGroupDescription } from '../../models/db/expense-group.model';

@Injectable({
  providedIn: 'root'
})
export class AccountingExportService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  private buildWorkspacePath(path: string): string {
    const appName = this.helper.getAppName();

    if (appName === 'sage50') {
      return `/${path}`;
    }

    return `/workspaces/${path}`;
  }

  xeroShortCode: string;

  getDateOptionsV2(): DateFilter[] {
    const currentDateTime = new Date();
    const dateOptions: DateFilter[] = [
      {
        dateRange: this.translocoService.translate('services.accountingExport.thisWeek'),
        startDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - currentDateTime.getDay()),
        endDate: currentDateTime
      },
      {
        dateRange: this.translocoService.translate('services.accountingExport.lastWeek'),
        startDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - currentDateTime.getDay() - 7),
        endDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - currentDateTime.getDay() - 1)
      },
      {
        dateRange: this.translocoService.translate('services.accountingExport.thisMonth'),
        startDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), 1),
        endDate: currentDateTime
      },
      {
        dateRange: this.translocoService.translate('services.accountingExport.lastMonth'),
        startDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() - 1, 1),
        endDate: new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), 0)
      }
    ];

    return dateOptions;
  }

  static getFyleExpenseUrl(expense_id: string): string {
    const url = `${environment.fyle_app_url}/app/admin/#/company_expenses?txnId=${expense_id}`;
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

  getReferenceType(description: ExpenseGroupDescription): FyleReferenceType {
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

  formatExportType(exportType: string, translocoService: TranslocoService): string {
    if (exportType.startsWith('CREATING_')) {
      exportType = exportType.substring('CREATING_'.length);
    }
    exportType = new SnakeCaseToSpaceCasePipe().transform(exportType);
    return new SentenceCasePipe(translocoService).transform(exportType);
  }

  getFyleReferenceNumber(referenceType: string, expense: Expense): string {
    if (referenceType === FyleReferenceType.EXPENSE) {
      return expense.expense_number;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      return expense.payment_number;
    } else if (referenceType === FyleReferenceType.REPORT_ID) {
      return expense.claim_number;
    }
    return expense.claim_number;
  }

  generateFyleUrl(expense: Expense, referenceType: FyleReferenceType, org_id: string) : string {
    let url = `${environment.fyle_app_url}/app/`;
    if (referenceType === FyleReferenceType.EXPENSE) {
      url += `admin/#/company_expenses?txnId=${expense.expense_id}`;
      return `${url}&org_id=${org_id}`;
    } else if (referenceType === FyleReferenceType.REPORT_ID) {
      url += `admin/#/reports/${expense.report_id}`;
      return `${url}?org_id=${org_id}`;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      url += `admin/#/settlements/${expense.settlement_id}`;
      return `${url}?org_id=${org_id}`;
    }
    return `${url}?org_id=${org_id}`;
  }

  parseAPIResponseToExportLog(accountingExport: AccountingExport, org_id: string, translocoService: TranslocoService): AccountingExportList {
    const referenceType = this.getReferenceType(accountingExport.description);
    const referenceNumber = this.getFyleReferenceNumber(referenceType, accountingExport.expenses[0]);
    return {
      exportedAt: accountingExport.exported_at,
      employee: [accountingExport.expenses[0].employee_name, accountingExport.description.employee_email],
      expenseType: accountingExport.fund_source === FundSource.CCC ? FundSource.CORPORATE_CARD : FundSource.REIMBURSABLE,
      referenceNumber: referenceNumber,
      exportedAs: this.formatExportType(accountingExport.type, translocoService),
      fyleUrl: this.generateFyleUrl(accountingExport.expenses[0], referenceType, org_id),
      integrationUrl: accountingExport.export_url,
      expenses: accountingExport.expenses
    };
  }

  generateExportTypeAndId(expenseGroup: ExpenseGroup) {
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
      exportType = this.translocoService.translate('services.accountingExport.journalEntry');
      exportId = expenseGroup.response_logs.JournalEntry.Id;
    } else if ('Purchase' in expenseGroup.response_logs && expenseGroup.response_logs.Purchase) {
      exportId = expenseGroup.response_logs.Purchase.Id;
      if (expenseGroup.response_logs.Purchase.PaymentType === 'Check') {
        exportRedirection = 'check';
        exportType = exportRedirection;
      } else {
        exportRedirection = 'expense';
        if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && !expenseGroup.response_logs.Purchase.Credit) {
          exportType = this.translocoService.translate('services.accountingExport.creditCardPurchase');
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && expenseGroup.response_logs.Purchase.Credit) {
          exportType = this.translocoService.translate('services.accountingExport.creditCardCredit');
          exportRedirection = 'creditcardcredit';
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'Cash') {
          exportType = this.translocoService.translate('services.accountingExport.debitCardExpense');
          exportRedirection = 'expense';
        } else {
          exportType = this.translocoService.translate('services.accountingExport.expense');
        }
      }
    }

    return [exportRedirection, exportId, exportType];
  }

  constructQBOExportUrlAndType(expenseGroup: ExpenseGroup): [string, string] {
    const [exportRedirection, exportId, exportType] = this.generateExportTypeAndId(expenseGroup);
    return [`${environment.qbo_app_url}/app/${exportRedirection}?txnId=${exportId}`, exportType];
  }

  constructIntacctExportUrlAndType(expenseGroup: ExpenseGroup): [string, string] {
    return [`https://www.intacct.com/ia/acct/ur.phtml?.r=${expenseGroup.response_logs?.url_id}`, expenseGroup.export_type];
  }

  constructXeroExportUrlAndType(expenseGroup: ExpenseGroup): [string, string] {
    let exportRedirection = '';
    let exportType = '';
    let exportId = null;
    let accountId = null;

    const xeroUrl = 'https://go.xero.com';
    if (expenseGroup.response_logs) {
      if ('Invoices' in expenseGroup.response_logs && expenseGroup.response_logs.Invoices) {
        exportType = 'Bill';
        exportId = expenseGroup.response_logs.Invoices[0].InvoiceID;
        if (this.xeroShortCode) {
          exportRedirection = `${xeroUrl}/organisationlogin/default.aspx?shortcode=${this.xeroShortCode}&redirecturl=/AccountsPayable/Edit.aspx?InvoiceID=${exportId}`;
        } else {
          exportRedirection = `${xeroUrl}/AccountsPayable/View.aspx?invoiceID=${exportId}`;
        }
      } else if ('BankTransactions' in expenseGroup.response_logs && expenseGroup.response_logs.BankTransactions) {
        exportType = this.translocoService.translate('services.accountingExport.bankTransaction');
        exportId = expenseGroup.response_logs.BankTransactions[0].BankTransactionID;
        accountId = expenseGroup.response_logs.BankTransactions[0].BankAccount.AccountID;
        if (this.xeroShortCode) {
          exportRedirection = `${xeroUrl}/organisationlogin/default.aspx?shortcode=${this.xeroShortCode}&redirecturl=/Bank/ViewTransaction.aspx?bankTransactionID=${exportId}`;
        } else {
          exportRedirection = `${xeroUrl}/Bank/ViewTransaction.aspx?bankTransactionID=${exportId}&accountID=${accountId}`;
        }
      }
    }
    return [exportRedirection, exportType];
  }

  constructNetsuiteExportUrlAndType(expenseGroup: ExpenseGroup, translocoService: TranslocoService): [string, string] {
    const words: string[] = expenseGroup.response_logs?.type.split(/(?=[A-Z])/);
    const exportType = new SentenceCasePipe(translocoService).transform(words?.join(' '));

    return [expenseGroup.export_url, exportType];
  }

  constructExportUrlAndType(appName: AppName, expenseGroup: ExpenseGroup, translocoService: TranslocoService): [string, string] {
    if (appName === AppName.QBO) {
      return this.constructQBOExportUrlAndType(expenseGroup);
    } else if (appName === AppName.INTACCT) {
      return this.constructIntacctExportUrlAndType(expenseGroup);
    } else if (appName === AppName.XERO) {
      return this.constructXeroExportUrlAndType(expenseGroup);
    } else if (appName === AppName.NETSUITE) {
      return this.constructNetsuiteExportUrlAndType(expenseGroup, translocoService);
    }

    return ['', ''];
  }

  parseExpenseGroupAPIResponseToExportLog(expenseGroup: ExpenseGroup, org_id: string, appName: AppName, translocoService: TranslocoService): AccountingExportList {
      const referenceType = this.getReferenceType(expenseGroup.description);
      const referenceNumber = this.getFyleReferenceNumber(referenceType, expenseGroup.expenses[0]);

      const [url, exportType] = this.constructExportUrlAndType(appName, expenseGroup, translocoService);
      return {
        exportedAt: expenseGroup.exported_at,
        employee: [expenseGroup.expenses[0].employee_name, expenseGroup.description.employee_email],
        expenseType: expenseGroup.fund_source === FundSource.CCC ? FundSource.CORPORATE_CARD : FundSource.REIMBURSABLE,
        referenceNumber: referenceNumber,
        exportedAs: exportType,
        fyleUrl: this.generateFyleUrl(expenseGroup.expenses[0], referenceType, org_id),
        integrationUrl: url,
        expenses: expenseGroup.expenses
      };
  }

  assignXeroShortCode(xeroShortCode: string){
    this.xeroShortCode = xeroShortCode;
  }

  getAccountingExportSummary(version?: string | 'v1', useRepurposedExportSummary?: boolean, appName?: AppName): Observable<AccountingExportSummary> {
    const apiParams: { start_date?: string } = {};
    if (useRepurposedExportSummary && appName && [AppName.XERO, AppName.QBO, AppName.NETSUITE, AppName.INTACCT, AppName.QBD_DIRECT, AppName.SAGE300].includes(appName)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      apiParams.start_date = today.toISOString();
    }
    if (version === 'v1') {
      // Temporary hack to enable repurposed export summary only for allowed apps - #q2_real_time_exports_integrations
      return this.apiService.get(this.buildWorkspacePath(`${this.workspaceService.getWorkspaceId()}/export_detail/`), apiParams);
    } else if (version === AppName.QBD_DIRECT) {
      return this.apiService.get(this.buildWorkspacePath(`${this.workspaceService.getWorkspaceId()}/export_logs/summary/`), apiParams);
    }

    return this.apiService.get(this.buildWorkspacePath(`${this.workspaceService.getWorkspaceId()}/accounting_exports/summary/`), apiParams);
  }

  getExportableAccountingExportCount(): Observable<AccountingExportCount> {
    const apiParams = {
      status__in: [AccountingExportStatus.READY, AccountingExportStatus.FAILED, AccountingExportStatus.FATAL]
    };
    return this.apiService.get(this.buildWorkspacePath(`${this.workspaceService.getWorkspaceId()}/accounting_exports/count/`), apiParams);
  }

  getAccountingExports(type: string[], status: string[], exportableAccountingExportIds: number[] | null, limit: number, offset: number, selectedDateFilter? : SelectedDateFilter | null, exportedAt?: string | null, searchQuery?: string | null, appName?: string): Observable<any> {
    const apiParams: AccountingExportGetParam = {
      type__in: type,
      status__in: status,
      limit: limit,
      offset: offset
    };

    if (searchQuery){
      apiParams.expenses__claim_number = searchQuery;
      apiParams.expenses__employee_email = searchQuery;
      apiParams.expenses__employee_name = searchQuery;
      apiParams.expenses__expense_number = searchQuery;
    }

    if (exportableAccountingExportIds?.length) {
      apiParams.id__in = exportableAccountingExportIds;
    }

    if (selectedDateFilter) {
      const exportedAtLte = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const exportedAtGte = selectedDateFilter.endDate.toLocaleDateString().split('/');
      apiParams.exported_at__gte = `${exportedAtLte[2]}-${exportedAtLte[1]}-${exportedAtLte[0]}T00:00:00`;
      apiParams.exported_at__lte = `${exportedAtGte[2]}-${exportedAtGte[1]}-${exportedAtGte[0]}T23:59:59`;
    }

    if (exportedAt) {
      apiParams.exported_at__gte = exportedAt;
    }

    if (appName === AppName.QBD_DIRECT) {
      if (apiParams.status__in?.includes(AccountingExportStatus.FAILED)) {
        apiParams.status__in = [AccountingExportStatus.ERROR, AccountingExportStatus.FATAL];
      }
      delete apiParams.type__in;
      return this.apiService.get(this.buildWorkspacePath(`${this.workspaceService.getWorkspaceId()}/export_logs/`), apiParams);
    }
      return this.apiService.get(this.buildWorkspacePath(`${this.workspaceService.getWorkspaceId()}/accounting_exports/`), apiParams);

  }

  @Cacheable()
  importExpensesFromFyle(version?: 'v1' | 'v2'): Observable<{}> {
    // Dedicated to qbd direct
    if (version === 'v2') {
      return this.apiService.post(this.buildWorkspacePath(`${this.workspaceService.getWorkspaceId()}/export_logs/sync/`), {});
    }
    return this.apiService.post(this.buildWorkspacePath(`${this.workspaceService.getWorkspaceId()}/fyle/${version === 'v1' ? 'expense_groups' : 'accounting_exports'}/sync/`), {});
  }
}
