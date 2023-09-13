import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginatorPage, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { SkipExportLogResponse, SkipExportList, SkipExportLog } from 'src/app/core/models/si/db/expense-group.model';
import { Paginator } from 'src/app/core/models/si/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ExportLogService } from 'src/app/core/services/si/export-log/export-log.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-skip-export-log',
  templateUrl: './skip-export-log.component.html',
  styleUrls: ['./skip-export-log.component.scss']
})
export class SkipExportLogComponent implements OnInit {

  isLoading: boolean = true;

  totalCount: number;

  limit: number;

  offset: number = 0;

  pageNo: number;

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

  skipExportLogForm: FormGroup;

  isCalendarVisible: boolean;

  isRecordPresent: boolean = false;

  expenseGroups: SkipExportList [];

  filteredExpenseGroups: SkipExportList [];

  expenses: any [] = [];

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
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService
  ) { }

  public filterTable(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredExpenseGroups = this.expenseGroups.filter((group: SkipExportList) => {
      const employeeID = group.employee ? group.employee[1] : '';
      const expenseType = group.expenseType ? group.expenseType : '';
      const referenceNumber = group.claim_number ? group.claim_number : '';

      return (
        employeeID.toLowerCase().includes(query) ||
        expenseType.toLowerCase().includes(query) ||
        referenceNumber.toLowerCase().includes(query)
      );
    });
  }

  offsetChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.getExpenseGroups(limit, this.offset);
  }

  pageChanges(offset: number): void {
    this.isLoading = true;
    this.offset = offset;
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
    if (this.skipExportLogForm.controls.dateRange.value !== this.dateOptions[3].dateRange) {
      this.isCalendarVisible = false;
    }
    this.isCalendarVisible = true;
  }

  showCalendar(event: Event) {
    event.stopPropagation();
    this.isCalendarVisible = true;
  }

  getDates() {
    this.dateOptions[3].dateRange = this.skipExportLogForm.value.start[0].toLocaleDateString() + '-' + this.skipExportLogForm.value.start[1].toLocaleDateString();
    this.dateOptions[3].startDate = this.skipExportLogForm.value.start[0];
    this.dateOptions[3].endDate = this.skipExportLogForm.value.start[1];
    this.presentDate = this.dateOptions[3].dateRange;
    this.skipExportLogForm.controls.dateRange.patchValue(this.dateOptions[3]);
    const event = {
      value: this.dateOptions[3]
    };
    this.dateFilter(event);
  }

  getExpenseGroups(limit: number, offset:number) {
    this.isLoading = true;
    const expenseGroups: SkipExportList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getSkipExportLogs(limit, offset).subscribe((skippedExpenses: SkipExportLogResponse) => {
      if (!this.isDateSelected) {
        this.totalCount = skippedExpenses.count;
      }
      skippedExpenses.results.forEach((skippedExpenses: SkipExportLog) => {
        expenseGroups.push({
          updated_at: skippedExpenses.updated_at,
          claim_number: skippedExpenses.claim_number,
          employee: [skippedExpenses.employee_name, skippedExpenses.employee_email],
          expenseType: skippedExpenses.fund_source === 'Personal' ? 'Reimbursable' : 'Corporate Card'
        });
      });
      this.filteredExpenseGroups = expenseGroups;
      this.expenseGroups = [...this.filteredExpenseGroups];
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

    this.skipExportLogForm.controls.dateRange.valueChanges.subscribe((dateRange) => {
      if (dateRange) {
        this.selectedDateFilter = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        };

        this.trackDateFilter('existing', this.selectedDateFilter);

        const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
        this.getExpenseGroups(paginator.limit, paginator.offset);
      }
    });
  }

  private getExpenseGroupsAndSetupPage(): void {
    this.setupForm();

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);

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
