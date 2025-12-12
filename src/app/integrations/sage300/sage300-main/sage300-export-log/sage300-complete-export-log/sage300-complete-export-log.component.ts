import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountingExportStatus, AccountingExportType, AppName, PaginatorPage, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { Expense } from 'src/app/core/models/intacct/db/expense.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/si-paginator.service';
import { AccountingExport, AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { WindowService } from 'src/app/core/services/common/window.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { UserService } from 'src/app/core/services/misc/user.service';

import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-sage300-complete-export-log',
    templateUrl: './sage300-complete-export-log.component.html',
    styleUrls: ['./sage300-complete-export-log.component.scss'],
    standalone: false
})
export class Sage300CompleteExportLogComponent implements OnInit {

  isLoading: boolean;

  appName: AppName = AppName.SAGE300;

  totalCount: number = 0;

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  dateOptions: DateFilter[] = [];

  selectedDateFilter: SelectedDateFilter | null;

  exportLogForm: FormGroup;

  isCalendarVisible: boolean;

  accountingExports: AccountingExportList [];

  filteredAccountingExports: AccountingExportList [] = [];

  expenses: Expense [] = [];

  isDateSelected: boolean = false;

  private org_id: string = this.userService.getUserProfile().org_id;

  searchQuery: string | null;

  private searchQuerySubject = new Subject<string>();

  hideCalendar: boolean;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private accountingExportService: AccountingExportService,
    private windowService: WindowService,
    private paginatorService: PaginatorService,
    private userService: UserService,
    private translocoService: TranslocoService
  ) {
    this.dateOptions = this.accountingExportService.getDateOptionsV2();
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

    this.accountingExportService.getAccountingExports([AccountingExportType.DIRECT_COSTS, AccountingExportType.PURCHASE_INVOICE], [AccountingExportStatus.COMPLETE], null, limit, offset, this.selectedDateFilter, null, this.searchQuery).subscribe(accountingExportResponse => {
        this.totalCount = accountingExportResponse.count;

        const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: AccountingExport) =>
          this.accountingExportService.parseAPIResponseToExportLog(accountingExport, this.org_id, this.translocoService)
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

        this.trackDateFilter('existing', this.selectedDateFilter);

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

  private trackDateFilter(filterType: 'existing' | 'custom', selectedDateFilter: SelectedDateFilter): void {
    const trackingProperty = {
      filterType,
      ...selectedDateFilter
    };
    this.trackingService.onDateFilter(TrackingApp.SAGE300, trackingProperty);
  }

  ngOnInit(): void {
    this.getAccountingExportsAndSetupPage();
  }

}
