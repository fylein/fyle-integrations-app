import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { brandingConfig, brandingContent, brandingStyle } from 'src/app/branding/branding-config';
import { AccountingExportModel, SkippedAccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { AppName, PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { SkipExportList, SkipExportLogResponse, SkipExportLog } from 'src/app/core/models/intacct/db/expense-group.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { UserService } from 'src/app/core/services/misc/user.service';

@Component({
  selector: 'app-netsuite-skipped-export-log',
  templateUrl: './netsuite-skipped-export-log.component.html',
  styleUrls: ['./netsuite-skipped-export-log.component.scss']
})
export class NetsuiteSkippedExportLogComponent implements OnInit {

  isLoading: boolean = true;

  totalCount: number = 0;

  skipExportLogForm: FormGroup;

  dateOptions: DateFilter[] = AccountingExportModel.getDateOptionsV2();

  expenses: SkipExportList[];

  filteredExpenses: SkipExportList[];

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  isDateSelected: boolean = false;

  selectedDateFilter: SelectedDateFilter | null;

  readonly brandingConfig = brandingConfig;

  searchQuery: string | null;

  private searchQuerySubject = new Subject<string>();

  hideCalendar: boolean;

  readonly brandingContent = brandingContent.exportLog;

  readonly brandingStyle = brandingStyle;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService
  ) {
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

  getSkippedExpenses(limit: number, offset: number) {
    this.isLoading = true;
    const skippedExpenseGroup: SkipExportList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getSkippedExpenses(limit, offset, this.selectedDateFilter, this.searchQuery, AppName.NETSUITE).subscribe((skippedExpenses: SkipExportLogResponse) => {
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

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.currentPage = 1;
    this.getSkippedExpenses(limit, this.offset);
    this.limit = limit;
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

    this.skipExportLogForm.controls.start.valueChanges.subscribe((dateRange) => {
      const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
      if (!dateRange) {
        this.dateOptions = AccountingExportModel.getDateOptionsV2();
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

  ngOnInit(): void {
    this.getSkippedExpensesAndSetupPage();
  }

}
