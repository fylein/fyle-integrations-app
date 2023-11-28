import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { AccountingExportStatus, FyleReferenceType, PaginatorPage, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { ExpenseGroupList } from 'src/app/core/models/si/db/expense-group.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { environment } from 'src/environments/environment';
import { Sage300ExportLogService } from 'src/app/core/services/sage300/sage300-export-log/sage300-export-log.service';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { Sage300AccountingExport } from 'src/app/core/models/sage300/db/sage300-accounting-export.model';

@Component({
  selector: 'app-sage300-completed-export-log',
  templateUrl: './sage300-completed-export-log.component.html',
  styleUrls: ['./sage300-completed-export-log.component.scss']
})
export class CompletedExportLogComponent implements OnInit {

  isLoading: boolean = false;

  isSearchFocused: boolean = false;

  isDateFieldFocused: boolean = false;

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

  presentDate = new Date().toLocaleDateString();

  exportLogForm: FormGroup;

  isCalendarVisible: boolean;

  isRecordPresent: boolean = false;

  expenseGroups: AccountingExportList [];

  filteredExpenseGroups: AccountingExportList [];

  expenses: Expense [] = [];

  isDateSelected: boolean = false;

  count: number;

  state: string;

  pageSize: number;

  pageNumber = 0;

  clickedExportLogIndex: number = 0;

  dateValue: Date;

  visible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private trackingService: TrackingService,
    private exportLogService: Sage300ExportLogService,
    private paginatorService: PaginatorService
  ) { }

  displayChildTable(index: number) {
    this.clickedExportLogIndex = index;
    this.expenses = this.filteredExpenseGroups[this.clickedExportLogIndex].expenses;
    this.visible = true;
  }

  openExpenseinFyle(expense_id: string) {
    const url = `${environment.fyle_app_url}/app/main/#/view_expense/${expense_id}`;
    window.open(url, '_blank');
  }

  openUrl(event: Event, url: string) {
    window.open(url, '_blank');
    event.stopPropagation();
  }

  removeFilter(formField: AbstractControl) {
    (formField as FormGroup).reset();
    event?.stopPropagation();
  }

  public filterTable(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredExpenseGroups = this.expenseGroups.filter((group: AccountingExportList) => {
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
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getExpenseGroups(limit, this.offset);
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.offset = offset;
    this.currentPage = Math.ceil(offset / this.limit) + 1;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getExpenseGroups(this.limit, offset);
  }

  dateFilter(event: any): void {
    this.isLoading = true;
    this.isDateSelected = true;
    this.selectedDateFilter = event.value;
    this.getExpenseGroups(this.limit, this.offset);
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
    this.presentDate = this.dateOptions[3].dateRange;
    this.exportLogForm.controls.dateRange.patchValue(this.dateOptions[3]);
  }

  getExpenseGroups(limit: number, offset:number) {
    this.isLoading = true;
    const expenseGroups: AccountingExportList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getExpenseGroups(AccountingExportStatus.COMPLETE, limit, offset, this.selectedDateFilter).subscribe(expenseGroupResponse => {
      if (!this.isDateSelected) {
        this.totalCount = expenseGroupResponse.count;
      }
      expenseGroupResponse.results.forEach((expenseGroup: Sage300AccountingExport) => {
        const referenceType: FyleReferenceType = this.exportLogService.getReferenceType(expenseGroup.description);
        let referenceNumber: string = expenseGroup.description[referenceType];

        if (referenceType === FyleReferenceType.EXPENSE) {
          referenceNumber = expenseGroup.expenses[0].expense_number;
        } else if (referenceType === FyleReferenceType.PAYMENT) {
          referenceNumber = expenseGroup.expenses[0].payment_number;
        }

        expenseGroups.push({
          exportedAt: expenseGroup.exported_at,
          employee: [expenseGroup.expenses[0].employee_name, expenseGroup.description.employee_email],
          expenseType: expenseGroup.fund_source === 'CCC' ? 'Corporate Card' : 'Reimbursable',
          fyleReferenceType: '',
          referenceNumber: referenceNumber,
          exportedAs: expenseGroup.type,
          fyleUrl: this.exportLogService.generateFyleUrl(expenseGroup, referenceType),
          integrationUrl: ``,
          expenses: expenseGroup.expenses
        });
      });
      this.filteredExpenseGroups = expenseGroups;
      this.expenseGroups = [...this.filteredExpenseGroups];
      this.isLoading = false;
    });
  }

  // creating_ for type

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
        this.getExpenseGroups(paginator.limit, paginator.offset);
      } else {
        this.selectedDateFilter = null;
        this.getExpenseGroups(paginator.limit, paginator.offset);
      }
    });
  }

  private getExpenseGroupsAndSetupPage(): void {
    this.setupForm();

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
    this.limit = paginator.limit;
    this.offset = paginator.offset;

    this.getExpenseGroups(paginator.limit, paginator.offset);
  }

  private trackDateFilter(filterType: 'existing' | 'custom', selectedDateFilter: SelectedDateFilter): void {
    const trackingProperty = {
      filterType,
      ...selectedDateFilter
    };
    this.trackingService.onDateFilter(trackingProperty);
  }

  ngOnInit(): void {
    this.getExpenseGroupsAndSetupPage();
  }

}
