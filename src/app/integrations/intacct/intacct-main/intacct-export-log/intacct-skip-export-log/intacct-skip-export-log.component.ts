import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginatorPage, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { SkipExportLogResponse, SkipExportList, SkipExportLog } from 'src/app/core/models/intacct/db/expense-group.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/si-paginator.service';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { SkippedAccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/core/services/misc/user.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';

@Component({
    selector: 'app-intacct-skip-export-log',
    templateUrl: './intacct-skip-export-log.component.html',
    styleUrls: ['./intacct-skip-export-log.component.scss'],
    standalone: false
})
export class IntacctSkipExportLogComponent implements OnInit {

  isLoading: boolean = true;

  expenses: SkipExportList[];

  filteredExpenses: SkipExportList[];

  isSearchFocused: boolean = false;

  isDateFieldFocused: boolean = false;

  totalCount: number;

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  dateOptions: DateFilter[] = [];

  selectedDateFilter?: SelectedDateFilter | null;

  presentDate = new Date().toLocaleDateString();

  skipExportLogForm: FormGroup;

  isDateSelected: boolean = false;

  count: number;

  state: string;

  pageSize: number;

  pageNumber = 0;

  readonly illustrationsAllowed: boolean = brandingFeatureConfig.illustrationsAllowed;

  readonly brandingConfig = brandingConfig;

  searchQuery?: string | null;

  private searchQuerySubject = new Subject<string>();

  hideCalendar: boolean;

  readonly brandingStyle = brandingStyle;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private trackingService: TrackingService,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService,
    private accountingExportService: AccountingExportService
  ) {
    this.dateOptions = this.accountingExportService.getDateOptionsV2();
    this.searchQuerySubject.pipe(
    debounceTime(1000)
  ).subscribe((query: string) => {
    this.searchQuery = query;
    this.offset = 0;
    this.currentPage = Math.ceil(this.offset / this.limit) + 1;
    this.getSkippedExpenses(this.limit, this.offset);
  });
}

  public handleSimpleSearch(query: string) {
    this.searchQuerySubject.next(query);
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.currentPage = 1;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getSkippedExpenses(limit, this.offset);
    this.limit = limit;
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.offset = offset;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getSkippedExpenses(this.limit, offset);
  }

  getSkippedExpenses(limit: number, offset: number) {
    this.isLoading = true;
    const skippedExpenseGroup: SkipExportList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getSkippedExpenses(limit, offset, this.selectedDateFilter, this.searchQuery).subscribe((skippedExpenses: SkipExportLogResponse) => {
      this.totalCount = skippedExpenses.count;
      const orgId = this.userService.getUserProfile().org_id;
      skippedExpenses.results.forEach((skippedExpense: SkipExportLog) => {
        skippedExpenseGroup.push(SkippedAccountingExportModel.parseAPIResponseToSkipExportList(skippedExpense, orgId));
      });

      this.filteredExpenses = skippedExpenseGroup;
      this.expenses = [...this.filteredExpenses];
      this.isLoading = false;
    });
  }

  private setupForm(): void {
    this.skipExportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });

    this.skipExportLogForm.controls.start.valueChanges.subscribe((dateRange) => {
      const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
      if (!dateRange) {
        this.dateOptions = this.accountingExportService.getDateOptionsV2();
        this.isDateSelected = false;
        this.selectedDateFilter = null;

        this.getSkippedExpenses(paginator.limit, paginator.offset);
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
        this.getSkippedExpenses(paginator.limit, paginator.offset);
    }
  });
  }

  private getSkippedExpensesAndSetupPage(): void {
    this.setupForm();

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
    this.limit = paginator.limit;
    this.offset = paginator.offset;

    this.getSkippedExpenses(paginator.limit, paginator.offset);
  }

  private trackDateFilter(filterType: 'existing' | 'custom', selectedDateFilter: SelectedDateFilter): void {
    const trackingProperty = {
      filterType,
      ...selectedDateFilter
    };
    this.trackingService.onDateFilter(TrackingApp.INTACCT, trackingProperty);
  }

  ngOnInit(): void {
    this.getSkippedExpensesAndSetupPage();
  }

}
