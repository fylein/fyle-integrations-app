import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { from, interval, switchMap, takeWhile } from 'rxjs';
import { QBDAccountingExportsState, QBDAccountingExportsType } from 'src/app/core/models/enum/enum.model';
import { AccountingExportsResult, QbdExportTriggerResponse, QbdAccountingExportDownload, QbdExportTriggerGet } from 'src/app/core/models/qbd/db/iif-logs.model';
import { DateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { QbdIifLogsService } from 'src/app/core/services/qbd/qbd-iif-log/qbd-iif-logs.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoading: boolean = false;

  accountingExports: QbdExportTriggerResponse;

  totalCount: number;

  limit: number = 10;

  pageNo: number = 0;

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

  selectedDateFilter: DateFilter | null = this.dateOptions[0];

  presentDate = new Date().toLocaleDateString();

  exportLogForm: FormGroup;

  isCalendarVisible: boolean = false;

  downloadingExportId: boolean[];

  exportInProgress: boolean = false;

  exportProgressPercentage: number;

  exportPresent: boolean = true;

  constructor(
    private iifLogsService: QbdIifLogsService,
    private formBuilder: FormBuilder
  ) { }

  getDates() {
    this.dateOptions[3].dateRange = this.exportLogForm.value.start[0].toLocaleDateString() + '-' + this.exportLogForm.value.start[1].toLocaleDateString();
    this.dateOptions[3].startDate = this.exportLogForm.value.start[0];
    this.dateOptions[3].endDate = this.exportLogForm.value.start[1];
    this.presentDate = this.dateOptions[3].dateRange;
    this.exportLogForm.controls.dateRange.patchValue(this.dateOptions[3].dateRange);
    const event = {
      value: this.dateOptions[3].dateRange
    };
    this.dateFilter(event);
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

  getExpenseType(type: string) {
    const expenseType = type === 'CCC' ? QBDAccountingExportsType.EXPORT_CREDIT_CARD_PURCHASES : QBDAccountingExportsType.EXPORT_REIMBURSABLE_EXPENSES;
    return expenseType.split("_").slice(1, -1).join(' ').split(",").join('');
  }

  getTypeString(type: string): string {
    return type.split("_").slice(1).join(' ').split(",").join('');
  }

  dateFilter(event: any): void {
    this.selectedDateFilter = event.value;
    this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, this.selectedDateFilter, null).subscribe((accountingExportsResult: QbdExportTriggerResponse) => {
      this.accountingExports = accountingExportsResult;
      this.totalCount = this.accountingExports.count;
    });
  }

  offsetChanges(limit: number): void {
    this.limit = limit;
    this.pageNo = 0;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, this.selectedDateFilter, null).subscribe((accountingExportsResult: QbdExportTriggerResponse) => {
      this.accountingExports = accountingExportsResult;
      this.totalCount = this.accountingExports.count;
    });
  }

  pageChanges(pageNo: number): void {
    this.pageNo = pageNo;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, this.selectedDateFilter, null).subscribe((accountingExportsResult: QbdExportTriggerResponse) => {
      this.accountingExports = accountingExportsResult;
      this.totalCount = this.accountingExports.count;
    });
  }

  triggerExports(): void {
    this.exportInProgress = true;
    this.iifLogsService.triggerQBDExport().subscribe((triggerResponse: QbdExportTriggerGet) => {
      this.exportPresent = triggerResponse.new_expenses_imported;
      if (triggerResponse.new_expenses_imported) {
        interval(3000).pipe(
          switchMap(() => from(this.iifLogsService.getQbdAccountingExports([QBDAccountingExportsState.ENQUEUED, QBDAccountingExportsState.IN_PROGRESS], this.limit, this.pageNo, null, null))),
          takeWhile((response) => response.results.filter(task => (task.status === QBDAccountingExportsState.IN_PROGRESS || task.status === QBDAccountingExportsState.ENQUEUED)).length > 0, true)
        ).subscribe((res) => {
          const processedCount = res.results.filter(task => (task.status !== QBDAccountingExportsState.IN_PROGRESS && task.status !== QBDAccountingExportsState.ENQUEUED)).length;
          this.exportProgressPercentage = Math.round((processedCount / res.count) * 100);
          this.exportInProgress = false;
        });
      }
    });
  }

  getDownloadLink(exportData: AccountingExportsResult, index: number): void {
    this.downloadingExportId[index] = true;
    this.iifLogsService.postQbdAccountingExports(exportData.id).subscribe((postQbdAccountingExports: QbdAccountingExportDownload) => {
      const link = document.createElement('a');
      link.setAttribute('href', postQbdAccountingExports.download_url);
      link.setAttribute('download', `${postQbdAccountingExports.file_id}.iif`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadingExportId[index] = false;
    }, () => {
      this.downloadingExportId[index] = false;
    });
  }

  setUpDashboard(): void {
    this.isLoading = true;
    this.exportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });
    this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, null, null).subscribe((accountingExportResponse: QbdExportTriggerResponse) => {
      this.accountingExports = accountingExportResponse;
      this.downloadingExportId =  [...Array(this.accountingExports.count).keys()].map(() => {
        return false;
      });
      this.totalCount = this.accountingExports.count;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setUpDashboard();
  }

}
