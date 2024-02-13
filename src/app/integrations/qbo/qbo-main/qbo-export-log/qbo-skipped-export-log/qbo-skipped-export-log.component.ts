import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountingExportModel, SkippedAccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { SkipExportList, SkipExportLog, SkipExportLogResponse } from 'src/app/core/models/intacct/db/expense-group.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { WindowService } from 'src/app/core/services/common/window.service';

import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-qbo-skipped-export-log',
  templateUrl: './qbo-skipped-export-log.component.html',
  styleUrls: ['./qbo-skipped-export-log.component.scss']
})
export class QboSkippedExportLogComponent implements OnInit {

  isLoading: boolean = true;

  totalCount: number = 0;

  skipExportLogForm: FormGroup;

  dateOptions: DateFilter[] = AccountingExportModel.getDateOptions();

  expenses: SkipExportList[];

  filteredExpenses: SkipExportList[];

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  isDateSelected: boolean = false;

  selectedDateFilter: SelectedDateFilter | null;

  searchedQuery: string | null;

  private searchQuerySubject = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private exportLogService: ExportLogService,
    private accountingExportService: AccountingExportService,
    private windowService: WindowService,
    private paginatorService: PaginatorService
  ) {
    this.searchQuerySubject.pipe(
      debounceTime(1000)
    ).subscribe((query: string) => {
      this.searchedQuery = query;
      const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
      this.getSkippedExpenses(paginator.limit, paginator.offset);
    });
  }

  public handleSimpleSearch(event: any) {
    const query = event.target.value;
    this.searchQuerySubject.next(query);
  }

  getSkippedExpenses(limit: number, offset: number) {
    this.isLoading = true;
    const skippedExpenseGroup: SkipExportList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getSkippedExpenses(limit, offset, this.selectedDateFilter, this.searchedQuery).subscribe((skippedExpenses: SkipExportLogResponse) => {
      if (!this.isDateSelected && !this.searchedQuery) {
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

        this.getSkippedExpenses(paginator.limit, paginator.offset);
      } else {
        this.dateOptions = AccountingExportModel.getDateOptions();
        this.skipExportLogForm.controls.start.patchValue([]);
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

  ngOnInit(): void {
    this.getSkippedExpensesAndSetupPage();
  }

}
