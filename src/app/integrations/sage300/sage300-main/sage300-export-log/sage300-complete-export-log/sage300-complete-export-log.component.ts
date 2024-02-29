import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { AccountingExportStatus, AccountingExportType, AppName, FundSource, FyleReferenceType, PaginatorPage, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { Expense } from 'src/app/core/models/intacct/db/expense.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { environment } from 'src/environments/environment';
import { AccountingExport, AccountingExportList, AccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { Sage300AccountingExport } from 'src/app/core/models/sage300/db/sage300-accounting-export.model';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { TitleCasePipe } from '@angular/common';
import { UserService } from 'src/app/core/services/misc/user.service';

@Component({
  selector: 'app-sage300-complete-export-log',
  templateUrl: './sage300-complete-export-log.component.html',
  styleUrls: ['./sage300-complete-export-log.component.scss']
})
export class Sage300CompleteExportLogComponent implements OnInit {

  isLoading: boolean;

  appName: AppName = AppName.SAGE300;

  totalCount: number = 0;

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  dateOptions: DateFilter[] = AccountingExportModel.getDateOptionsV2();

  selectedDateFilter: SelectedDateFilter | null;

  exportLogForm: FormGroup;

  isCalendarVisible: boolean;

  accountingExports: AccountingExportList [];

  filteredAccountingExports: AccountingExportList [] = [];

  expenses: Expense [] = [];

  isDateSelected: boolean = false;

  private org_id: string = this.userService.getUserProfile().org_id;

  constructor(
    private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private accountingExportService: AccountingExportService,
    private windowService: WindowService,
    private paginatorService: PaginatorService,
    private userService: UserService
  ) { }

  openExpenseinFyle(expense_id: string) {
    this.windowService.openInNewTab(AccountingExportModel.getFyleExpenseUrl(expense_id));
  }

  public handleSimpleSearch(query: string) {
    this.filteredAccountingExports = this.accountingExports.filter((group: AccountingExportList) => {
      return AccountingExportModel.getfilteredAccountingExports(query, group);
    });
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.currentPage = 1;
    this.getAccountingExports(limit, this.offset);
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

    this.accountingExportService.getAccountingExports([AccountingExportType.DIRECT_COSTS, AccountingExportType.PURCHASE_INVOICE], [AccountingExportStatus.COMPLETE], null, limit, offset, this.selectedDateFilter).subscribe(accountingExportResponse => {
        if (!this.isDateSelected) {
          this.totalCount = accountingExportResponse.count;
        }
        const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: AccountingExport) =>
          AccountingExportModel.parseAPIResponseToExportLog(accountingExport, this.org_id)
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
        this.getAccountingExports(paginator.limit, paginator.offset);
      } else if (dateRange.length && dateRange[1]) {
        this.selectedDateFilter = {
          startDate: dateRange[0],
          endDate: dateRange[1]
        };

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
    this.trackingService.onDateFilter(TrackingApp.SAGE300, trackingProperty);
  }

  ngOnInit(): void {
    this.getAccountingExportsAndSetupPage();
  }

}
