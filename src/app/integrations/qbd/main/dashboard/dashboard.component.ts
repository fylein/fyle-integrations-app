import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { AccountingExportsResult, QbdAccountingExportsGet, GetQbdAccountingExportsPayload, QbdAccountingExportsPost } from 'src/app/core/models/qbd/db/iif-logs.model';
import { DateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { QbdIifLogsService } from 'src/app/core/services/qbd/qbd-iif-log/qbd-iif-logs.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoading: boolean = false;

  selectedDateFilter: any = null;

  first: number = 0;

  start: number = 0;

  end: number = 10;

  accountingExports: QbdAccountingExportsGet;

  isDownloadLinkReady: boolean = true;

  totalCount: number;

  offsetAccountingExports: AccountingExportsResult[];

  offset: number = 10;

  pageNo: any;

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

  exportLogForm: any;

  constructor(
    private iifLogsService: QbdIifLogsService,
    private workspaceService: QbdWorkspaceService,
    private formBuilder: FormBuilder
  ) { }

  dateFilterFn(event:any) {
    this.selectedDateFilter = event.value;
    this.offsetAccountingExports = this.accountingExports.results.filter((data:AccountingExportsResult) => {
      return new Date(data.created_at) > this.selectedDateFilter.startDate && new Date(data.created_at) < this.selectedDateFilter.endDate;
    });
    this.offsetAccountingExports.slice(this.start, this.end);
    this.totalCount = this.offsetAccountingExports.length;
  }

  dateFilterChanges() {
    if (this.selectedDateFilter) {
      this.offsetAccountingExports = this.accountingExports.results.filter((data:AccountingExportsResult) => {
        return new Date(data.created_at) > this.selectedDateFilter.startDate && new Date(data.created_at) < this.selectedDateFilter.endDate;
      });
      this.offsetAccountingExports.slice(this.start, this.end);
    } else {
      this.offsetAccountingExports = this.accountingExports.results.slice(this.start, this.end);
    }
  }

  offsetChanges(offset: number) {
    this.offset = offset;
    this.pageNo = 1;
    this.end = this.pageNo * this.offset;
    this.start = this.end - this.offset;
    this.dateFilterChanges();
  }

  pageChanges(pageNo: number) {
    this.pageNo = pageNo;
    this.end = this.pageNo * this.offset;
    this.start = this.end - this.offset;
    this.dateFilterChanges();
  }

  getExportTime(dateTime: AccountingExportsResult): string {
    const date = new Date(dateTime.created_at);
    return date.toTimeString().slice(0, 5);
  }

  getDownloadLink(exports: AccountingExportsResult) {
    this.isDownloadLinkReady = false;
    this.iifLogsService.postQbdAccountingExports(exports.id).subscribe((postQbdAccountingExports: QbdAccountingExportsPost) => {
      const link = document.createElement('a');
      link.setAttribute('href', postQbdAccountingExports.download_url);
      link.setAttribute('download', `qcd.iif`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.isDownloadLinkReady = true;
    });
  }

  setUpDashboard() {
    this.isLoading = true;
    this.exportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });
    const data:GetQbdAccountingExportsPayload = {
      id: +this.workspaceService.getWorkspaceId(),
      type: "FETCHING_REIMBURSABLE_EXPENSES",
      status: 'COMPLETE'
    };
    this.iifLogsService.getQbdAccountingExports(data).subscribe((accountingExportResponse: QbdAccountingExportsGet) => {
      this.accountingExports = {
        count: 14,
        next: null,
        previous: null,
        results: [
            {
                id: 2,
                type: "EXPORT_BILLS",
                file_id: "fieZ6GMSmgkb",
                task_id: null,
                status: "COMPLETE",
                errors: null,
                created_at: new Date("2023-02-09T12:39:31.005110Z"),
                updated_at: new Date("2023-02-09T12:39:31.005110Z"),
                workspace: 1
            },
            {
                id: 1,
                type: "FETCHING_REIMBURSABLE_EXPENSES",
                file_id: null,
                task_id: null,
                status: "COMPLETE",
                errors: null,
                created_at: new Date("2023-02-09T12:39:31.005110Z"),
                updated_at: new Date("2023-02-09T12:39:31.005110Z"),
                workspace: 1
            },
            {
              id: 2,
              type: "EXPORT_BILLS",
              file_id: "fieZ6GMSmgkb",
              task_id: null,
              status: "COMPLETE",
              errors: null,
              created_at: new Date("2022-02-09T12:39:31.005110Z"),
              updated_at: new Date("2022-02-09T12:39:31.005110Z"),
              workspace: 1
          },
          {
              id: 1,
              type: "FETCHING_REIMBURSABLE_EXPENSES",
              file_id: null,
              task_id: null,
              status: "COMPLETE",
              errors: null,
              created_at: new Date("2022-02-09T12:39:31.005110Z"),
              updated_at: new Date("2022-02-09T12:39:31.005110Z"),
              workspace: 1
          },
          {
            id: 2,
            type: "EXPORT_BILLS",
            file_id: "fieZ6GMSmgkb",
            task_id: null,
            status: "COMPLETE",
            errors: null,
            created_at: new Date("2022-02-09T12:39:31.005110Z"),
            updated_at: new Date("2022-02-09T12:39:31.005110Z"),
            workspace: 1
        },
        {
            id: 1,
            type: "FETCHING_REIMBURSABLE_EXPENSES",
            file_id: null,
            task_id: null,
            status: "COMPLETE",
            errors: null,
            created_at: new Date("2022-02-09T12:39:31.005110Z"),
            updated_at: new Date("2022-02-09T12:39:31.005110Z"),
            workspace: 1
        },
        {
          id: 2,
          type: "EXPORT_BILLS",
          file_id: "fieZ6GMSmgkb",
          task_id: null,
          status: "COMPLETE",
          errors: null,
          created_at: new Date("2022-02-09T12:39:31.005110Z"),
          updated_at: new Date("2022-02-09T12:39:31.005110Z"),
          workspace: 1
      },
      {
          id: 1,
          type: "FETCHING_REIMBURSABLE_EXPENSES",
          file_id: null,
          task_id: null,
          status: "COMPLETE",
          errors: null,
          created_at: new Date("2022-02-09T12:39:31.005110Z"),
          updated_at: new Date("2022-02-09T12:39:31.005110Z"),
          workspace: 1
      },
      {
        id: 2,
        type: "EXPORT_BILLS",
        file_id: "fieZ6GMSmgkb",
        task_id: null,
        status: "COMPLETE",
        errors: null,
        created_at: new Date("2022-02-09T12:39:31.005110Z"),
        updated_at: new Date("2022-02-09T12:39:31.005110Z"),
        workspace: 1
    },
    {
        id: 1,
        type: "FETCHING_REIMBURSABLE_EXPENSES",
        file_id: null,
        task_id: null,
        status: "COMPLETE",
        errors: null,
        created_at: new Date("2022-02-09T12:39:31.005110Z"),
        updated_at: new Date("2022-02-09T12:39:31.005110Z"),
        workspace: 1
    },
    {
      id: 2,
      type: "EXPORT_BILLS",
      file_id: "fieZ6GMSmgkb",
      task_id: null,
      status: "COMPLETE",
      errors: null,
      created_at: new Date("2022-02-09T12:39:31.005110Z"),
      updated_at: new Date("2022-02-09T12:39:31.005110Z"),
      workspace: 1
  },
  {
      id: 1,
      type: "FETCHING_REIMBURSABLE_EXPENSESss",
      file_id: null,
      task_id: null,
      status: "COMPLETE",
      errors: null,
      created_at: new Date("2022-02-09T12:39:31.005110Z"),
      updated_at: new Date("2022-02-09T12:39:31.005110Z"),
      workspace: 1
  },
  {
    id: 2,
    type: "EXPORT_BILLSss",
    file_id: "fieZ6GMSmgkb",
    task_id: null,
    status: "COMPLETE",
    errors: null,
    created_at: new Date("2022-02-09T12:39:31.005110Z"),
    updated_at: new Date("2022-02-09T12:39:31.005110Z"),
    workspace: 1
},
{
    id: 1,
    type: "FETCHING_REIMBURSABLE_EXPENSESss",
    file_id: null,
    task_id: null,
    status: "COMPLETE",
    errors: null,
    created_at: new Date("2023-02-09T12:39:31.005110Z"),
    updated_at: new Date("2023-02-09T12:39:31.005110Z"),
    workspace: 1
}
        ]
    };
      this.offsetAccountingExports = this.accountingExports.results.slice(this.start, this.end);
      this.totalCount = this.accountingExports.count;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setUpDashboard();
  }

}
