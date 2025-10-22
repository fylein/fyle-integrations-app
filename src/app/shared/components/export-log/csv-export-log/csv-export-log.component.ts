import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, debounceTime } from 'rxjs';
import { TableModule } from 'primeng/table';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoService } from '@jsverse/transloco';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';

interface CsvExportLogItem {
  expenses: {
    fund_source?: 'PERSONAL' | 'CCC';
  }[];
  exported_at?: string;
  error_count?: number;
  file_name?: string;
  file_id?: string;
}

@Component({
  selector: 'app-csv-export-log',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, TableModule],
  templateUrl: './csv-export-log.component.html',
  styleUrl: './csv-export-log.component.scss'
})
export class CsvExportLogComponent implements OnInit {

  @Input({ required: true }) updateExportLogs!: (limit: number, offset:number, selectedDateFilter: SelectedDateFilter | null, searchQuery: string | null) => Observable<any>;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  exportLogs: CsvExportLogItem[] = [];

  isLoading: boolean = false;

  totalCount: number = 0;

  limit: number = 10;

  offset: number = 0;

  currentPage: number = 1;

  dateOptions: DateFilter[] = [];

  selectedDateFilter: SelectedDateFilter | null = null;

  exportLogForm: FormGroup;

  hideCalendar: boolean = false;

  isDateSelected: boolean = false;

  searchQuery: string | null = null;

  private searchQuerySubject = new Subject<string>();

  getExpenseType(exportLog: CsvExportLogItem): string {
    let isReimbursable = false;
    let isCCC = false;

    for (const expense of exportLog.expenses) {
      if (expense.fund_source === 'PERSONAL') {
        isReimbursable = true;
      } else if (expense.fund_source === 'CCC') {
        isCCC = true;
      }
    }

    const reimbursableString = this.translocoService.translate('csvExportLog.reimbursableType');
    const cccString = this.translocoService.translate('csvExportLog.cccType');

    const types: string[] = [];
    if (isReimbursable) {
      types.push(reimbursableString);
    }
    if (isCCC) {
      types.push(cccString);
    }

    return types.join(', ');
  }

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private accountingExportService: AccountingExportService,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService,
    private translocoService: TranslocoService
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

  downloadFile(fileId: string) {
    this.exportLogService.getDownloadUrl(fileId).subscribe((response) => {
      this.exportLogService.renameAndDownloadFile(response.download_url, 'abc.csv');
    });
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

  private applyFilters(): void {
    this.isLoading = true;
    this.updateExportLogs(
      this.limit, this.offset, this.selectedDateFilter, this.searchQuery
    ).subscribe((exportLogsResponse) => {
      this.totalCount = exportLogsResponse.count;
      this.exportLogs = exportLogsResponse.results;
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
      }
      this.applyFilters();
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
