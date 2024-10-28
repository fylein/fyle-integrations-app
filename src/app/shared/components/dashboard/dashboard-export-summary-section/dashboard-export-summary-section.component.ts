import { Component, Input, OnInit } from '@angular/core';
import { brandingConfig, brandingContent } from 'src/app/branding/branding-config';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { AccountingExport, AccountingExportList, AccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { ExpenseGroup, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { AccountingExportStatus, AppName, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { UserService } from 'src/app/core/services/misc/user.service';

@Component({
  selector: 'app-dashboard-export-summary-section',
  templateUrl: './dashboard-export-summary-section.component.html',
  styleUrls: ['./dashboard-export-summary-section.component.scss']
})
export class DashboardExportSummarySectionComponent implements OnInit {

  @Input() accountingExportSummary: AccountingExportSummary | null;

  @Input() appName: AppName;

  @Input() accountingExportType: string[];

  @Input() exportLogVersion: 'v1' | 'v2' = 'v2';

  filteredAccountingExports: AccountingExportList[] = [];

  accountingExports: AccountingExportList[];

  exportLogHeader: string;

  exportLogSubHeader: string;

  isExportLogFetchInProgress: boolean;

  AccountingExportStatus = AccountingExportStatus;

  isExportLogVisible: boolean;

  AppName = AppName;

  private org_id: string = this.userService.getUserProfile().org_id;

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent.dashboard;

  constructor(
    private accountingExportService: AccountingExportService,
    private exportLogService: ExportLogService,
    private userService: UserService
  ) { }

  handleDialogClose(){
    this.isExportLogVisible = false;
  }

  private setFormattedAccountingExport(accountingExports: AccountingExportList[]): void {
    this.filteredAccountingExports = accountingExports;
    this.accountingExports = [...this.filteredAccountingExports];
  }

  private getExpenseGroups(limit: number, offset: number, status: AccountingExportStatus, lastExportedAt?: string | null): void {
    const dateFilter:SelectedDateFilter = {
      startDate: lastExportedAt ? new Date(lastExportedAt) : new Date(),
      endDate: new Date()
    };
    this.exportLogService.getExpenseGroups((status as unknown as TaskLogState), limit, offset, lastExportedAt ? dateFilter : null, lastExportedAt, '', this.appName).subscribe((accountingExportResponse: ExpenseGroupResponse) => {
      const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: ExpenseGroup) =>
        AccountingExportModel.parseExpenseGroupAPIResponseToExportLog(accountingExport, this.org_id, this.appName)
      );
      this.setFormattedAccountingExport(accountingExports);
    });
  }

  private getAccountingExports(limit: number, offset: number, status: AccountingExportStatus, lastExportedAt?: string | null) {
    const dateFilter:SelectedDateFilter = {
      startDate: lastExportedAt ? new Date(lastExportedAt) : new Date(),
      endDate: new Date()
    };
    this.accountingExportService.getAccountingExports(this.accountingExportType, [status], null, limit, offset, lastExportedAt ? dateFilter : null, lastExportedAt).subscribe(accountingExportResponse => {
      const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: AccountingExport) =>
        AccountingExportModel.parseAPIResponseToExportLog(accountingExport, this.org_id)
      );
      this.setFormattedAccountingExport(accountingExports);
    });
  }

  private setupAccountingExports(limit: number, offset: number, status: AccountingExportStatus) {
    if (this.accountingExportSummary) {
      const lastExportedAt = status === AccountingExportStatus.COMPLETE ? this.accountingExportSummary.last_exported_at : null;
      if (this.exportLogVersion === 'v1') {
        this.getExpenseGroups(limit, offset, status, lastExportedAt);
      } else {
        this.getAccountingExports(limit, offset, status, lastExportedAt);
      }
    }
  }

  showExportLog(status: AccountingExportStatus) {
    this.filteredAccountingExports = [];
    this.isExportLogFetchInProgress = true;
    this.exportLogHeader = status === AccountingExportStatus.COMPLETE ? 'Successful' : brandingContent.dashboard.exportLogHeader;
    this.exportLogSubHeader = status === AccountingExportStatus.COMPLETE ? 'These expenses have been successfully exported to your ' + this.appName +'.' : brandingContent.dashboard.exportLogSubHeader;
    this.setupAccountingExports(500, 0, status);
    this.isExportLogVisible = true;
  }

  ngOnInit(): void {
  }

}
