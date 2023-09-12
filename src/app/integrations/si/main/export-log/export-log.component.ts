import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { PaginatorPage, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { ExpenseGroup, ExpenseGroupList } from 'src/app/core/models/si/db/expense-group.model';
import { Paginator } from 'src/app/core/models/si/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ExportLogService } from 'src/app/core/services/si/export-log/export-log.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-export-log',
  templateUrl: './export-log.component.html',
  styleUrls: ['./export-log.component.scss']
})
export class ExportLogComponent implements OnInit {

  isLoading: boolean = false;

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

  modules: MenuItem[] = [
    {label: 'Completed', routerLink: '/integrations/intacct/main/export_log/'},
    {label: 'Skipped', routerLink: '/integrations/intacct/main/export_log/'}
  ];

  activeModule: MenuItem;

  selectedDateFilter: SelectedDateFilter | null;

  presentDate = new Date().toLocaleDateString();

  exportLogForm: FormGroup;

  isCalendarVisible: boolean;

  isRecordPresent: boolean = false;

  expenseGroups: ExpenseGroupList [];

  filteredExpenseGroups: ExpenseGroupList [];

  expenses: any [] = [];

  isDateSelected: boolean = false;

  count: number;

  state: string;

  pageSize: number;

  pageNumber = 0;

  clickedExportLogIndex: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private exportLogService: ExportLogService,
    private paginatorService: PaginatorService,
    private trackingService: TrackingService
  ) { }

  dateValue: Date;

  visible: boolean = false;

  displayChildTable(index: number) {
    this.clickedExportLogIndex = index;
    this.expenses = this.filteredExpenseGroups[this.clickedExportLogIndex].expenses;
    this.visible = true;
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }

  public filterTable(event: any) {
    const query = event.target.value.toLowerCase();

    this.filteredExpenseGroups = this.expenseGroups.filter((group: ExpenseGroupList) => {
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
    if (this.exportLogForm.controls.dateRange.value !== this.dateOptions[3].dateRange) {
      this.isCalendarVisible = false;
    }
    this.isCalendarVisible = true;
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
    const event = {
      value: this.dateOptions[3]
    };
    this.dateFilter(event);
  }

  getExpenseGroups(limit: number, offset:number) {
    this.isLoading = true;
    const expenseGroups: ExpenseGroupList[] = [];

    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.EXPORT_LOG, limit);
    }

    return this.exportLogService.getExpenseGroups(TaskLogState.COMPLETE, limit, offset, this.selectedDateFilter).subscribe(expenseGroupResponse => {
      if (!this.isDateSelected) {
        this.totalCount = expenseGroupResponse.count;
      }
      expenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup, index: number = 0) => {
        expenseGroups.push({
          index: index++,
          exportedAt: expenseGroup.exported_at,
          employee: [expenseGroup.employee_name, expenseGroup.description.employee_email],
          expenseType: expenseGroup.fund_source === 'CCC' ? 'Corporate Card' : 'Reimbursable',
          fyleReferenceType: null,
          referenceNumber: expenseGroup.description.claim_number,
          exportedAs: expenseGroup.export_type,
          fyleUrl: `${environment.fyle_app_url}/app/main/#/enterprise/view_expense/${'expense_id'}`,
          intacctUrl: `https://www-p02.intacct.com/ia/acct/ur.phtml?.r=${expenseGroup.response_logs?.url_id}`,
          expenses: expenseGroup.expenses
        });
      });
      this.filteredExpenseGroups = expenseGroups;
      this.expenseGroups = [...this.filteredExpenseGroups];
      this.isLoading = false;
    });
  }

  private trackDateFilter(filterType: 'existing' | 'custom', selectedDateFilter: SelectedDateFilter): void {
    const trackingProperty = {
      filterType,
      ...selectedDateFilter
    };
    this.trackingService.onDateFilter(trackingProperty);
  }

  private setupForm(): void {
    this.exportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });

    this.exportLogForm.controls.dateRange.valueChanges.subscribe((dateRange) => {
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


  ngOnInit(): void {
    this.getExpenseGroupsAndSetupPage();
  }

}
