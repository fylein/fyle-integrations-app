import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SkippedAccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { SkipExportList, SkipExportLog, SkipExportLogResponse } from 'src/app/core/models/si/db/expense-group.model';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-business-central-skipped-export-log',
  templateUrl: './business-central-skipped-export-log.component.html',
  styleUrls: ['./business-central-skipped-export-log.component.scss']
})
export class BusinessCentralSkippedExportLogComponent implements OnInit {

  isLoading: boolean;

  totalCount: number = 0;

  skipExportLogForm: FormGroup;

  expenses: SkipExportList[];

  filteredExpenses: SkipExportList[];

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  isDateSelected: boolean = false;

  selectedDateFilter: SelectedDateFilter | null;

  constructor(
    private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService
  ) { }

  public handleSimpleSearch(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredExpenses = this.expenses.filter((group: SkipExportList) => {
      return SkippedAccountingExportModel.getfilteredSkippedAccountingExports(query, group);
    });
  }

  getSkippedExpenses(limit: number, offset: number) {
    this.isLoading = true;
    const skippedExpenseGroup: SkipExportList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getSkippedExpenses(limit, offset).subscribe((skippedExpenses: SkipExportLogResponse) => {
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

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.currentPage = 1;
    this.getSkippedExpenses(limit, this.offset);
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.offset = offset;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.getSkippedExpenses(this.limit, offset);
  }

  private setupForm(): void {
    this.skipExportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });

    this.skipExportLogForm.controls.dateRange.valueChanges.subscribe((dateRange) => {
      const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
      if (dateRange) {
        this.selectedDateFilter = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        };

        this.trackDateFilter('existing', this.selectedDateFilter);
        this.getSkippedExpenses(paginator.limit, paginator.offset);
      } else {
        this.selectedDateFilter = null;
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
    this.trackingService.onDateFilter(trackingProperty);
  }

  ngOnInit(): void {
    this.getSkippedExpensesAndSetupPage();
  }

}
