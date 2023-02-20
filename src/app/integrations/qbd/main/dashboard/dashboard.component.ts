import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { from, interval, switchMap, takeWhile } from 'rxjs';
import { QBDAccountingExportsState, QBDAccountingExportsType } from 'src/app/core/models/enum/enum.model';
import { AccountingExportsResult, QbdExportTriggerResponse, QbdAccountingExportDownload } from 'src/app/core/models/qbd/db/iif-logs.model';
import { DateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { QbdIifLogsService } from 'src/app/core/services/qbd/qbd-iif-log/qbd-iif-logs.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoading: boolean = false;

  selectedDateFilter: DateFilter | null = null;

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
    }
  ];

  exportLogForm: FormGroup;

  downloadingExportId: number[];

  exportInProgress: boolean = false;

  value: number;

  constructor(
    private iifLogsService: QbdIifLogsService,
    private formBuilder: FormBuilder
  ) { }

  getTypeString(type:string): string {
    return type.split("_").slice(1).join(' ').split(",").join('');
  }

  dateFilterFn(event:any): void {
    this.selectedDateFilter = event.value;
    this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, this.selectedDateFilter, null).subscribe((accountingExportsResult: QbdExportTriggerResponse) => {
      this.accountingExports = accountingExportsResult;
      this.totalCount = this.accountingExports.count;
    });
  }

  offsetChanges(limit: number): void {
    this.limit = limit;
    this.pageNo = 1;
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

  getExportTime(dateTime: AccountingExportsResult): string {
    const date = new Date(dateTime.created_at);
    return date.toTimeString().slice(0, 5);
  }

  triggerExports(): void {
    this.exportInProgress = true;
    this.value = 25;
    this.iifLogsService.postQbdTriggerExport().subscribe(() => {
      this.value = 50;
      interval(3000).pipe(
        switchMap(() => from(this.iifLogsService.getQbdAccountingExports([QBDAccountingExportsState.ENQUEUED, QBDAccountingExportsState.IN_PROGRESS], this.limit, this.pageNo, null, null))),
        takeWhile((response) => response.results.filter(task => (task.status === QBDAccountingExportsState.IN_PROGRESS || task.status === QBDAccountingExportsState.ENQUEUED)).length > 0, true)
      ).subscribe((res) => {
        const processedCount = res.results.filter(task => (task.status !== QBDAccountingExportsState.IN_PROGRESS && task.status !== QBDAccountingExportsState.ENQUEUED)).length;
        this.value = Math.round((processedCount / res.count) * 100);
        this.exportInProgress = false;
      });
    });
  }

  getDownloadLink(exportData: AccountingExportsResult, index: number): void {
    this.downloadingExportId[index] = 1;
    this.iifLogsService.postQbdAccountingExports(exportData.id).subscribe((postQbdAccountingExports: QbdAccountingExportDownload) => {
      const link = document.createElement('a');
      link.setAttribute('href', postQbdAccountingExports.download_url);
      link.setAttribute('download', `qcd.iif`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadingExportId[index] = 0;
    }, () => {
      this.downloadingExportId[index] = 0;
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
        return 0;
      });
      this.totalCount = this.accountingExports.count;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setUpDashboard();
  }

}
