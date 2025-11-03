import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, debounceTime } from 'rxjs';
import { TableModule } from 'primeng/table';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { ClickEvent, PaginatorPage, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoService } from '@jsverse/transloco';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { SkipExportList, SkipExportLog } from 'src/app/core/models/intacct/db/expense-group.model';
import { SkippedAccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { UserService } from 'src/app/core/services/misc/user.service';
import { CsvExpensesTableComponent } from "../csv-expenses-table/csv-expenses-table.component";
import { CsvExportLogDialogComponent } from "../csv-export-log-dialog/csv-export-log-dialog.component";
import { ExpenseDetails } from 'src/app/core/models/db/expense-details.model';
import { CsvExportLogItem } from 'src/app/core/models/db/csv-export-log.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';


@Component({
  selector: 'app-csv-export-log',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, TableModule, CsvExpensesTableComponent, CsvExportLogDialogComponent],
  templateUrl: './csv-export-log.component.html',
  styleUrl: './csv-export-log.component.scss'
})
export class CsvExportLogComponent implements OnInit {

  @Input({ required: true }) updateRecords!: (limit: number, offset:number, selectedDateFilter: SelectedDateFilter | null, searchQuery: string | null) => Observable<any>;

  @Input() isSkippedExpenses: boolean = false;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  records: (CsvExportLogItem | SkipExportList)[] = [];

  get skippedExpenses() {
    return this.records as SkipExportList[];
  }

  isLoading: boolean = false;

  isExpensesDialogOpen: boolean = false;

  totalCount: number = 0;

  limit: number = 10;

  offset: number = 0;

  currentPage: number = 1;

  dateOptions: DateFilter[] = [];

  selectedDateFilter: SelectedDateFilter | null = null;

  selectedExportLog: CsvExportLogItem | null = null;

  selectedExpenses: ExpenseDetails[] = [];

  exportLogForm: FormGroup;

  hideCalendar: boolean = false;

  isDateSelected: boolean = false;

  searchQuery: string | null = null;

  private searchQuerySubject = new Subject<string>();

  getExpenseType(exportLog: CsvExportLogItem): string {
    return this.exportLogService.getExpenseType(exportLog);
  }

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private accountingExportService: AccountingExportService,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService,
    private translocoService: TranslocoService,
    private userService: UserService,
    private trackingService: TrackingService
  ) {
    this.dateOptions = this.accountingExportService.getDateOptionsV2();
    this.searchQuerySubject.pipe(
      debounceTime(1000)
    ).subscribe((query: string) => {
      this.searchQuery = query;
      this.offset = 0;
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  openExpensesDialog(exportLog: CsvExportLogItem) {
    const orgId = this.userService.getUserProfile().org_id;
    this.selectedExportLog = exportLog;
    this.selectedExpenses = exportLog.expenses.map(expense => (
      SkippedAccountingExportModel.parseAPIResponseToSkipExportList(expense, orgId)
    ));
    this.isExpensesDialogOpen = true;
  }


  downloadFile(event: Event, exportLog: CsvExportLogItem) {
    this.trackingService.onClickEvent(TrackingApp.SAGE50, ClickEvent.DOWNLOAD_CSV, {fileName: exportLog.file_name, fileId: exportLog.file_id, view: 'Export Log list view'});
    event.stopPropagation();
    this.exportLogService.downloadFile(exportLog);
  }

  constructFileName(exportLog: CsvExportLogItem): string {
    return this.exportLogService.constructFileName(exportLog);
  }

  public handleSimpleSearch(query: string) {
    this.searchQuerySubject.next(query);
  }

  pageSizeChanges(limit: number): void {
    this.limit = limit;
    this.currentPage = 1;
    this.offset = 0;
    this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    this.applyFilters();
  }

  pageChanges(offset: number): void {
    this.offset = offset;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.applyFilters();
  }

  applyFilters(): void {
    this.isLoading = true;
    this.updateRecords(
      this.limit, this.offset, this.selectedDateFilter, this.searchQuery
    ).subscribe((recordsResponse) => {
      this.totalCount = recordsResponse.count;
      if (this.isSkippedExpenses) {
        const orgId = this.userService.getUserProfile().org_id;
        this.records = recordsResponse.results.map(
          (skippedExpense: SkipExportLog) => SkippedAccountingExportModel.parseAPIResponseToSkipExportList(skippedExpense, orgId)
        );
      } else {
        this.records = recordsResponse.results;
      }
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
      if (!dateRange) {
        this.dateOptions = this.accountingExportService.getDateOptionsV2();
        this.selectedDateFilter = null;
        this.isDateSelected = false;
        this.applyFilters();
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
        this.applyFilters();
      }
    });
  }

  ngOnInit(): void {
    this.setupForm();

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
    this.limit = paginator.limit;
    this.offset = paginator.offset;

    this.applyFilters();
  }
}
