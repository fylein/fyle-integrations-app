import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppName, PaginatorPage, TaskLogState, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { ExpenseGroup, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { Expense } from 'src/app/core/models/intacct/db/expense.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { environment } from 'src/environments/environment';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AccountingExportList, AccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { UserService } from 'src/app/core/services/misc/user.service';

@Component({
  selector: 'app-intacct-completed-export-log',
  templateUrl: './intacct-completed-export-log.component.html',
  styleUrls: ['./intacct-completed-export-log.component.scss']
})
export class IntacctCompletedExportLogComponent implements OnInit {

  isLoading: boolean = false;

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

  constructor(
    private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService,
    private userService: UserService
  ) { }

  openExpenseinFyle(expense_id: string) {
    const url = `${environment.fyle_app_url}/app/admin/#/view_expense/${expense_id}`;
    window.open(url, '_blank');
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

    this.exportLogService.getExpenseGroups(TaskLogState.COMPLETE, limit, offset, this.selectedDateFilter).subscribe((accountingExportResponse: ExpenseGroupResponse) => {
      if (!this.isDateSelected) {
        this.totalCount = accountingExportResponse.count;
      }
      console.log(accountingExportResponse);
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
    this.trackingService.onDateFilter(TrackingApp.INTACCT, trackingProperty);
  }

  ngOnInit(): void {
    this.getAccountingExportsAndSetupPage();
  }

}
