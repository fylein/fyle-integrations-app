import { Component, Input, OnInit } from '@angular/core';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { AccountingExport, AccountingExportList, AccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { AccountingExportStatus, AppName, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';

@Component({
  selector: 'app-dashboard-export-summary-section',
  templateUrl: './dashboard-export-summary-section.component.html',
  styleUrls: ['./dashboard-export-summary-section.component.scss']
})
export class DashboardExportSummarySectionComponent implements OnInit {

  @Input() accountingExportSummary: AccountingExportSummary | null;

  @Input() appName: AppName;

  @Input() accountingExportType: string[];

  filteredAccountingExports: AccountingExportList[] = [];

  accountingExports: AccountingExportList[];

  exportLogHeader: string;

  isExportLogFetchInProgress: boolean;

  selectedDateFilter: SelectedDateFilter | null;

  taskLogStatusComplete: AccountingExportStatus = AccountingExportStatus.COMPLETE;

  taskLogStatusFailed: AccountingExportStatus = AccountingExportStatus.FAILED;

  isExportLogVisible: boolean;

  constructor(
    private accountingExportService: AccountingExportService,
    private exportLogService: ExportLogService
  ) { }

  handleDialogClose(){
    this.isExportLogVisible = false;
  }

  getAccountingExports(limit: number, offset: number, status: AccountingExportStatus) {
    if (this.accountingExportSummary) {
      this.selectedDateFilter = {startDate: new Date(this.accountingExportSummary.last_exported_at), endDate: new Date};

      this.accountingExportService.getAccountingExports(this.accountingExportType, [status], null, limit, offset, this.selectedDateFilter).subscribe(accountingExportResponse => {
          const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: AccountingExport) =>
            AccountingExportModel.parseAPIResponseToExportLog(accountingExport, this.exportLogService)
          );
          this.filteredAccountingExports = accountingExports;
          this.accountingExports = [...this.filteredAccountingExports];
        });
    }
  }

  showExportLog(status: AccountingExportStatus) {
    this.isExportLogFetchInProgress = true;
    this.exportLogHeader = status === this.taskLogStatusComplete ? 'Successful' : 'Failed';
    this.getAccountingExports(500, 0, status);
    this.isExportLogVisible = true;
  }

  ngOnInit(): void {
  }

}
