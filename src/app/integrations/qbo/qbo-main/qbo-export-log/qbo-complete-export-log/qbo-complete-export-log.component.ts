import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountingExportList, AccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { ExpenseGroup, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { AppName, PaginatorPage, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';

@Component({
  selector: 'app-qbo-complete-export-log',
  templateUrl: './qbo-complete-export-log.component.html',
  styleUrls: ['./qbo-complete-export-log.component.scss']
})
export class QboCompleteExportLogComponent implements OnInit {

  isLoading: boolean;

  appName: AppName = AppName.QBO;

  totalCount: number = 0;

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  dateOptions: DateFilter[] = AccountingExportModel.getDateOptions();

  selectedDateFilter: SelectedDateFilter | null;

  exportLogForm: FormGroup;

  isCalendarVisible: boolean;

  accountingExports: AccountingExportList [];

  filteredAccountingExports: AccountingExportList [];

  expenses: Expense[] = [];

  isDateSelected: boolean = false;

  private org_id: string = this.userService.getUserProfile('user').org_id;

  constructor(
    private formBuilder: FormBuilder,
    private exportLogService: ExportLogService,
    private windowService: WindowService,
    private paginatorService: PaginatorService,
    private userService: UserService
  ) { }

  openExpenseinFyle(expense_id: string) {
    this.windowService.openInNewTab(AccountingExportModel.getFyleExpenseUrl(expense_id));
  }

  public handleSimpleSearch(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredAccountingExports = this.accountingExports.filter((group: AccountingExportList) => {
      return AccountingExportModel.getfilteredAccountingExports(query, group);
    });
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.currentPage = 1;
    this.getAccountingExports(limit, this.offset);
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.offset = offset;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.getAccountingExports(this.limit, offset);
  }

  dateFilter(event: any): void {
    this.isLoading = true;
    this.isDateSelected = true;
    this.selectedDateFilter = event.value;
    this.getAccountingExports(this.limit, this.offset);
  }

  private getAccountingExports(limit: number, offset:number) {
    this.isLoading = true;

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    this.exportLogService.getExpenseGroups(TaskLogState.COMPLETE, limit, offset, this.selectedDateFilter).subscribe((accountingExportResponse: ExpenseGroupResponse) => {
      if (!this.isDateSelected) {
        this.totalCount = accountingExportResponse.count;
      }

      const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: ExpenseGroup) =>
        AccountingExportModel.parseExpenseGroupAPIResponseToExportLog(accountingExport, this.org_id)
      );
      this.filteredAccountingExports = accountingExports;
      this.accountingExports = [...this.filteredAccountingExports];
      this.isLoading = false;
    });
  }

  private setupForm(): void {
    this.exportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });

    this.exportLogForm.controls.dateRange.valueChanges.subscribe((dateRange) => {
      const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
      if (dateRange) {
        this.selectedDateFilter = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        };

        this.getAccountingExports(paginator.limit, paginator.offset);
      } else {
        this.selectedDateFilter = null;
        this.getAccountingExports(paginator.limit, paginator.offset);
      }
    });
  }

  private getAccountingExportsAndSetupPage(): void {
    this.setupForm();

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
    this.limit = paginator.limit;
    this.offset = paginator.offset;

    this.getAccountingExports(paginator.limit, paginator.offset);
  }

  ngOnInit(): void {
    this.getAccountingExportsAndSetupPage();
  }

}
