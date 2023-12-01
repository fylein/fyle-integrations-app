import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SkippedAccountingExportClass } from 'src/app/core/models/db/accounting-export.model';
import { SkipExportList } from 'src/app/core/models/si/db/expense-group.model';

@Component({
  selector: 'app-sage300-skipped-export-log',
  templateUrl: './sage300-skipped-export-log.component.html',
  styleUrls: ['./sage300-skipped-export-log.component.scss']
})
export class Sage300SkippedExportLogComponent implements OnInit {

  isLoading: boolean;

  totalCount: number;

  skipExportLogForm: FormGroup;

  accountingExports: SkipExportList[];

  filteredAccountingExports: SkipExportList[];

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  constructor() { }

  public handleSimpleSearch(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredAccountingExports = this.accountingExports.filter((group: SkipExportList) => {
      return SkippedAccountingExportClass.getfilteredSkippedAccountingExports(query, group);
    });
  }

  getSkippedAccountingExports(limit: number, offset:number) {
    this.isLoading = true;
    const expenseGroups: SkipExportList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getSkipExportLogs(limit, offset).subscribe((skippedExpenses: SkipExportLogResponse) => {
      if (!this.isDateSelected) {
        this.totalCount = skippedExpenses.count;
      }
      skippedExpenses.results.forEach((skippedExpenses: SkipExportLog) => {
        expenseGroups.push({
          updated_at: skippedExpenses.updated_at,
          claim_number: skippedExpenses.claim_number,
          employee: [skippedExpenses.employee_name, skippedExpenses.employee_email],
          expenseType: skippedExpenses.fund_source === 'PERSONAL' ? 'Reimbursable' : 'Corporate Card',
          fyleUrl: `${environment.fyle_app_url}/app/main/#/view_expense/${skippedExpenses.expense_id}`
        });
      });
      this.filteredExpenseGroups = expenseGroups;
      this.expenseGroups = [...this.filteredExpenseGroups];
      this.isLoading = false;
    });
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.currentPage = 1;
    this.getSkippedAccountingExports(limit, this.offset);
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.offset = offset;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.getSkippedAccountingExports(this.limit, offset);
  }

  ngOnInit(): void {
  }

}
