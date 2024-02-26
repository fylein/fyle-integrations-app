import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginatorPage, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { SkipExportLogResponse, SkipExportList, SkipExportLog } from 'src/app/core/models/intacct/db/expense-group.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AccountingExportModel, SkippedAccountingExportModel } from 'src/app/core/models/db/accounting-export.model';

@Component({
  selector: 'app-intacct-skip-export-log',
  templateUrl: './intacct-skip-export-log.component.html',
  styleUrls: ['./intacct-skip-export-log.component.scss']
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

  dateOptions: DateFilter[] = AccountingExportModel.getDateOptionsV2();

  selectedDateFilter: SelectedDateFilter | null;

  presentDate = new Date().toLocaleDateString();

  skipExportLogForm: FormGroup;

  isCalendarVisible: boolean;

  isRecordPresent: boolean = false;

  isDateSelected: boolean = false;

  count: number;

  state: string;

  pageSize: number;

  pageNumber = 0;

  clickedExportLogIndex: number = 0;

  dateValue: Date;

  visible: boolean = false;

  readonly illustrationsAllowed: boolean = brandingFeatureConfig.illustrationsAllowed;

  readonly brandingConfig = brandingConfig;

  constructor(
    private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService
  ) { }

  public handleSimpleSearch(query: string) {
    this.filteredExpenses = this.expenses.filter((group: SkipExportList) => {
      return SkippedAccountingExportModel.getfilteredSkippedAccountingExports(query, group);
    });
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.currentPage = 1;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getSkippedExpenses(limit, this.offset);
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.offset = offset;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getSkippedExpenses(this.limit, offset);
  }

  dateFilter(event: any): void {
    this.isLoading = true;
    this.isDateSelected = true;
    this.selectedDateFilter = event.value;
    this.getSkippedExpenses(this.limit, this.offset);
  }

  getSkippedExpenses(limit: number, offset: number) {
    this.isLoading = true;
    const skippedExpenseGroup: SkipExportList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getSkippedExpenses(limit, offset, this.selectedDateFilter).subscribe((skippedExpenses: SkipExportLogResponse) => {
      if (!this.isDateSelected) {
        this.totalCount = skippedExpenses.count;
      }

      skippedExpenses.results.forEach((skippedExpense: SkipExportLog) => {
        skippedExpenseGroup.push(SkippedAccountingExportModel.parseAPIResponseToSkipExportList(skippedExpense));
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
      if (dateRange[1]) {
        this.selectedDateFilter = {
          startDate: dateRange[0],
          endDate: dateRange[1]
        };

        this.trackDateFilter('existing', this.selectedDateFilter);

        const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
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
