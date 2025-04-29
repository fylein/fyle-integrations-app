import { Component, Input, OnInit } from '@angular/core';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
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

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

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

  private getExpenseGroups(limit: number, offset: number, status: AccountingExportStatus, lastExportedAt?: string | null, lastUpdatedAt?: string | null): void {
    let startDate = null;

    if (lastExportedAt) {
      startDate = new Date(lastExportedAt);
    } else if (lastUpdatedAt) {
      startDate = new Date(lastUpdatedAt);
    } else {
      startDate = new Date();
    }

    const dateFilter: SelectedDateFilter = {
      startDate: startDate,
      endDate: new Date()
    };
    this.exportLogService.getExpenseGroups((status as unknown as TaskLogState), limit, offset, lastExportedAt || lastUpdatedAt ? dateFilter : null, lastExportedAt, '', this.appName).subscribe((accountingExportResponse: ExpenseGroupResponse) => {
      const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: ExpenseGroup) =>
        AccountingExportModel.parseExpenseGroupAPIResponseToExportLog(accountingExport, this.org_id, this.appName)
      );
      this.setFormattedAccountingExport(accountingExports);
    });
  }

  private getAccountingExports(limit: number, offset: number, status: AccountingExportStatus, lastExportedAt?: string | null) {
    this.accountingExportService.getAccountingExports(this.accountingExportType, [status], null, limit, offset, null, lastExportedAt, null, this.appName).subscribe(accountingExportResponse => {
      const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: AccountingExport) =>
        AccountingExportModel.parseAPIResponseToExportLog(accountingExport, this.org_id)
      );
      this.setFormattedAccountingExport(accountingExports);
    });
  }

  private setupAccountingExports(limit: number, offset: number, status: AccountingExportStatus) {
    if (this.accountingExportSummary) {
      let lastExportedAt = null;
      let lastUpdatedAt = null;

      if (status === AccountingExportStatus.COMPLETE) {
        // Temporary hack to enable repurposed export summary only for xero
        if (this.brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary && this.appName === AppName.XERO) {
          lastExportedAt = this.accountingExportSummary.repurposed_last_exported_at;
        } else {
          lastExportedAt = this.accountingExportSummary.last_exported_at;
        }
      } else if (status === AccountingExportStatus.FAILED) {
        lastUpdatedAt = this.accountingExportSummary.repurposed_last_exported_at;
      }

      if (this.exportLogVersion === 'v1') {
        this.getExpenseGroups(limit, offset, status, lastExportedAt, lastUpdatedAt);
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
