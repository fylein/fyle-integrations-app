import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { AccountingExportStatus, AppName, FyleReferenceType, PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { environment } from 'src/environments/environment';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { Sage300AccountingExport } from 'src/app/core/models/sage300/db/sage300-accounting-export.model';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';

@Component({
  selector: 'app-sage300-complete-export-log',
  templateUrl: './sage300-complete-export-log.component.html',
  styleUrls: ['./sage300-complete-export-log.component.scss']
})
export class Sage300CompleteExportLogComponent implements OnInit {

  isLoading: boolean;

  appName: AppName = AppName.SAGE300;

  totalCount: number;

  limit: number;

  offset: number = 0;

  currentPage: number = 1;

  dateOptions: DateFilter[] = [
    {
      dateRange: 'This Month',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    },
    {
      dateRange: 'This Week',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()),
      endDate: new Date()
    },
    {
      dateRange: 'Today',
      startDate: new Date(),
      endDate: new Date()
    },
    {
      dateRange: new Date().toLocaleDateString(),
      startDate: new Date(),
      endDate: new Date()
    }
  ];

  selectedDateFilter: SelectedDateFilter | null;

  exportLogForm: FormGroup;

  isCalendarVisible: boolean;

  accountingExports: AccountingExportList [];

  filteredAccountingExports: AccountingExportList [];

  expenses: Expense [] = [];

  isDateSelected: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService
  ) { }

  openExpenseinFyle(expense_id: string) {
    const url = `${environment.fyle_app_url}/app/main/#/view_expense/${expense_id}`;
    window.open(url, '_blank');
  }

  public filterTableChange(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredAccountingExports = this.accountingExports.filter((group: AccountingExportList) => {
      const employeeName = group.employee ? group.employee[0] : '';
      const employeeID = group.employee ? group.employee[1] : '';
      const expenseType = group.expenseType ? group.expenseType : '';
      const referenceNumber = group.referenceNumber ? group.referenceNumber : '';

      return (
        employeeName.toLowerCase().includes(query) ||
        employeeID.toLowerCase().includes(query) ||
        expenseType.toLowerCase().includes(query) ||
        referenceNumber.toLowerCase().includes(query)
      );
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

  dateFilter(event: any): void {
    this.isLoading = true;
    this.isDateSelected = true;
    this.selectedDateFilter = event.value;
    this.getAccountingExports(this.limit, this.offset);
  }

  dropDownWatcher() {
    if (this.exportLogForm.controls.dateRange.value !== this.dateOptions[3].dateRange) {
      this.isCalendarVisible = false;
    } else {
      this.isCalendarVisible = true;
    }
  }

  showCalendar(event: Event) {
    event.stopPropagation();
    this.isCalendarVisible = true;
  }

  getDates() {
    this.dateOptions[3].dateRange = this.exportLogForm.value.start[0].toLocaleDateString() + '-' + this.exportLogForm.value.start[1].toLocaleDateString();
    this.dateOptions[3].startDate = this.exportLogForm.value.start[0];
    this.dateOptions[3].endDate = this.exportLogForm.value.start[1];
    this.exportLogForm.controls.dateRange.patchValue(this.dateOptions[3]);
  }

  getAccountingExports(limit: number, offset:number) {
    this.isLoading = true;
    const accountingExports: AccountingExportList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getAccountingExports(AccountingExportStatus.COMPLETE, limit, offset, this.selectedDateFilter).subscribe(accountingExportResponse => {
      if (!this.isDateSelected) {
        this.totalCount = accountingExportResponse.count;
      }
      accountingExportResponse.results.forEach((accountingExport: Sage300AccountingExport) => {
        const referenceType: FyleReferenceType = this.exportLogService.getReferenceType(accountingExport.description);
        let referenceNumber: string = accountingExport.description[referenceType];

        if (referenceType === FyleReferenceType.EXPENSE) {
          referenceNumber = accountingExport.expenses[0].expense_number;
        } else if (referenceType === FyleReferenceType.PAYMENT) {
          referenceNumber = accountingExport.expenses[0].payment_number;
        }

        accountingExports.push({
          exportedAt: accountingExport.exported_at,
          employee: [accountingExport.expenses[0].employee_name, accountingExport.description.employee_email],
          expenseType: accountingExport.fund_source === 'CCC' ? 'Corporate Card' : 'Reimbursable',
          fyleReferenceType: '',
          referenceNumber: referenceNumber,
          exportedAs: accountingExport.type,
          fyleUrl: this.exportLogService.generateFyleUrl(accountingExport, referenceType),
          integrationUrl: accountingExport.export_url,
          expenses: accountingExport.expenses
        });
      });
      this.filteredAccountingExports = accountingExports;
      this.accountingExports = [...this.filteredAccountingExports];
      this.isLoading = false;
    });
  }

  // creating_ for type: fyleReferenceType

  private setupForm(): void {
    this.exportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });

    this.exportLogForm.controls.dateRange.valueChanges.subscribe((dateRange) => {
      const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
      if (dateRange) {
        this.selectedDateFilter = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        };

        this.trackDateFilter('existing', this.selectedDateFilter);
        this.getAccountingExports(paginator.limit, paginator.offset);
      } else {
        this.selectedDateFilter = null;
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
    this.trackingService.onDateFilter(trackingProperty);
  }

  ngOnInit(): void {
    this.getAccountingExportsAndSetupPage();
  }

}
