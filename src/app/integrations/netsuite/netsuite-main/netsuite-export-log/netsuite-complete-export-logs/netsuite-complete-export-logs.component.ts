import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { Subject, debounceTime } from 'rxjs';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { ExpenseGroupResponse, ExpenseGroup } from 'src/app/core/models/db/expense-group.model';
import { AppName, PaginatorPage, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { Expense } from 'src/app/core/models/intacct/db/expense.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';

@Component({
    selector: 'app-netsuite-complete-export-logs',
    templateUrl: './netsuite-complete-export-logs.component.html',
    styleUrls: ['./netsuite-complete-export-logs.component.scss'],
    standalone: false
})
export class NetsuiteCompleteExportLogsComponent implements OnInit {

  isLoading: boolean;

  appName: AppName = AppName.NETSUITE;

  totalCount: number = 0;

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  dateOptions: DateFilter[] = [];

  selectedDateFilter: SelectedDateFilter | null;

  exportLogForm: FormGroup;

  hideCalendar: boolean;

  accountingExports: AccountingExportList [];

  filteredAccountingExports: AccountingExportList [];

  expenses: Expense[] = [];

  isDateSelected: boolean = false;

  private org_id: string = this.userService.getUserProfile().org_id;

  readonly brandingConfig = brandingConfig;

  searchQuery: string | null;

  private searchQuerySubject = new Subject<string>();

  readonly brandingStyle = brandingStyle;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private exportLogService: ExportLogService,
    private windowService: WindowService,
    private paginatorService: PaginatorService,
    private userService: UserService,
    private translocoService: TranslocoService,
    private accountingExportService: AccountingExportService
  ) {
    this.searchQuerySubject.pipe(
      debounceTime(1000)
    ).subscribe((query: string) => {
      this.searchQuery = query;
      this.offset = 0;
      this.currentPage = Math.ceil(this.offset / this.limit) + 1;
      this.getAccountingExports(this.limit, this.offset);
    });
  }

  openExpenseinFyle(expense_id: string) {
    this.windowService.openInNewTab(AccountingExportService.getFyleExpenseUrl(expense_id));
  }

  public handleSimpleSearch(query: string) {
    this.searchQuerySubject.next(query);
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.currentPage = 1;
    this.getAccountingExports(limit, this.offset);
    this.limit = limit;
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.offset = offset;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.getAccountingExports(this.limit, offset);
  }

  private getAccountingExports(limit: number, offset:number) {
    this.isLoading = true;

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    this.exportLogService.getExpenseGroups(TaskLogState.COMPLETE, limit, offset, this.selectedDateFilter, null, this.searchQuery, AppName.NETSUITE).subscribe((accountingExportResponse: ExpenseGroupResponse) => {
        this.totalCount = accountingExportResponse.count;

      const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: ExpenseGroup) =>
        this.accountingExportService.parseExpenseGroupAPIResponseToExportLog(accountingExport, this.org_id, AppName.NETSUITE, this.translocoService)
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

    this.exportLogForm.controls.start.valueChanges.subscribe((dateRange: string | any[]) => {
      const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
      if (!dateRange) {
        this.dateOptions = this.accountingExportService.getDateOptionsV2();
        this.selectedDateFilter = null;
        this.isDateSelected = false;
        this.getAccountingExports(paginator.limit, paginator.offset);
      } else if (dateRange.length && dateRange[1]) {
        this.hideCalendar = true;
        this.selectedDateFilter = {
          startDate: dateRange[0],
          endDate: dateRange[1]
        };

        this.isDateSelected = true;

        setTimeout(() => {
          this.hideCalendar = false;
        }, 10);

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
    this.dateOptions = this.accountingExportService.getDateOptionsV2();
    this.getAccountingExportsAndSetupPage();
  }

}
