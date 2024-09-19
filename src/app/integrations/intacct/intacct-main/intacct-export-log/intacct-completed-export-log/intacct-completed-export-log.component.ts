import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AppName, PaginatorPage, TaskLogState, TrackingApp } from 'src/app/core/models/enum/enum.model';
import type { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import type { ExpenseGroup, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import type { Expense } from 'src/app/core/models/intacct/db/expense.model';
import type { Paginator } from 'src/app/core/models/misc/paginator.model';
import type { TrackingService } from 'src/app/core/services/integration/tracking.service';
import type { ExportLogService } from 'src/app/core/services/common/export-log.service';
import type { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { environment } from 'src/environments/environment';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import type { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { AccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import type { UserService } from 'src/app/core/services/misc/user.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-intacct-completed-export-log',
  templateUrl: './intacct-completed-export-log.component.html',
  styleUrls: ['./intacct-completed-export-log.component.scss']
})
export class IntacctCompletedExportLogComponent implements OnInit {

  isLoading: boolean = false;

  hideCalendar: boolean;

  appName: AppName = AppName.INTACCT;

  accountingExports: AccountingExportList [];

  filteredAccountingExports: AccountingExportList [];

  totalCount: number;

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  dateOptions: DateFilter[] = AccountingExportModel.getDateOptionsV2();

  selectedDateFilter: SelectedDateFilter | null;

  exportLogForm: FormGroup;

  expenses: Expense [] = [];

  isDateSelected: boolean = false;

  count: number;

  state: string;

  pageSize: number;

  pageNumber = 0;

  private org_id: string = this.userService.getUserProfile().org_id;

  readonly illustrationsAllowed: boolean = brandingFeatureConfig.illustrationsAllowed;

  readonly brandingConfig = brandingConfig;

  searchQuery: string | null;

  private searchQuerySubject = new Subject<string>();

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService,
    private userService: UserService
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
    const url = `${environment.fyle_app_url}/app/admin/#/view_expense/${expense_id}`;
    window.open(url, '_blank');
  }

  public handleSimpleSearch(query: string) {
    this.searchQuerySubject.next(query);
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.currentPage = 1;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getAccountingExports(limit, this.offset);
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.offset = offset;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getAccountingExports(this.limit, offset);
  }


  private getAccountingExports(limit: number, offset:number) {
    this.isLoading = true;

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    this.exportLogService.getExpenseGroups(TaskLogState.COMPLETE, limit, offset, this.selectedDateFilter, null, this.searchQuery).subscribe((accountingExportResponse: ExpenseGroupResponse) => {

      this.totalCount = accountingExportResponse.count;

      const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: ExpenseGroup) =>
        AccountingExportModel.parseExpenseGroupAPIResponseToExportLog(accountingExport, this.org_id, this.appName)
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

    this.exportLogForm.controls.start.valueChanges.subscribe((dateRange) => {
      const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
      if (!dateRange) {
        this.dateOptions = AccountingExportModel.getDateOptionsV2();
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

          this.trackDateFilter('existing', this.selectedDateFilter);
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

  private trackDateFilter(filterType: 'existing' | 'custom', selectedDateFilter: SelectedDateFilter): void {
    const trackingProperty = {
      filterType,
      ...selectedDateFilter
    };
    this.trackingService.onDateFilter(TrackingApp.INTACCT, trackingProperty);
  }

  ngOnInit(): void {
    this.getAccountingExportsAndSetupPage();
  }

}
