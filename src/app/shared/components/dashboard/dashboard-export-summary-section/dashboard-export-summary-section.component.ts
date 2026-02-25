import { Component, Input, OnInit } from '@angular/core';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { AccountingExport, AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { ExpenseGroup, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { AccountingExportStatus, AppName, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-dashboard-export-summary-section',
    templateUrl: './dashboard-export-summary-section.component.html',
    styleUrls: ['./dashboard-export-summary-section.component.scss'],
    standalone: false
})
export class DashboardExportSummarySectionComponent implements OnInit {

  @Input() accountingExportSummary: AccountingExportSummary | null;

  @Input() appName: AppName;

  @Input() accountingExportType: string[];

  @Input() exportLogVersion: 'v1' | 'v2' = 'v2';

  @Input() isRealTimeExportEnabled: boolean;

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

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private accountingExportService: AccountingExportService,
    private exportLogService: ExportLogService,
    private userService: UserService,
    private translocoService: TranslocoService
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
        this.accountingExportService.parseExpenseGroupAPIResponseToExportLog(accountingExport, this.org_id, this.appName, this.translocoService)
      );
      this.setFormattedAccountingExport(accountingExports);
    });
  }

  private getAccountingExports(limit: number, offset: number, status: AccountingExportStatus, lastExportedAt?: string | null) {
    this.accountingExportService.getAccountingExports(this.accountingExportType, [status], null, limit, offset, null, lastExportedAt, null, this.appName).subscribe(accountingExportResponse => {
      const accountingExports: AccountingExportList[] = accountingExportResponse.results.map((accountingExport: AccountingExport) =>
        this.accountingExportService.parseAPIResponseToExportLog(accountingExport, this.org_id, this.translocoService)
      );
      this.setFormattedAccountingExport(accountingExports);
    });
  }

  private setupAccountingExports(limit: number, offset: number, status: AccountingExportStatus) {
    if (this.accountingExportSummary) {
      let lastExportedAt = null;
      let lastUpdatedAt = null;

      if (status === AccountingExportStatus.COMPLETE) {
        // Temporary hack to enable repurposed export summary only for allowed apps - #q2_real_time_exports_integrations
        if ([AppName.XERO, AppName.QBO, AppName.NETSUITE, AppName.INTACCT, AppName.QBD_DIRECT, AppName.SAGE300].includes(this.appName)) {
          lastExportedAt = this.accountingExportSummary.repurposed_last_exported_at;
        } else {
          lastExportedAt = this.accountingExportSummary.last_exported_at;
        }
      } else if (status === AccountingExportStatus.FAILED && [AppName.XERO, AppName.QBO, AppName.NETSUITE, AppName.INTACCT, AppName.QBD_DIRECT, AppName.SAGE300].includes(this.appName)) {
        // Temporary hack to enable repurposed export summary only for allowed apps - #q2_real_time_exports_integrations
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
    this.exportLogHeader = status === AccountingExportStatus.COMPLETE ? this.translocoService.translate('dashboard.exportLogHeaderSuccessful') : this.translocoService.translate('dashboard.exportLogHeaderFailed');
    this.exportLogSubHeader = status === AccountingExportStatus.COMPLETE ? this.translocoService.translate('dashboard.exportLogSubHeaderSuccessful', { appName: this.appName }) : this.translocoService.translate('dashboard.exportLogSubHeaderFailed', { appName: this.appName });
    this.setupAccountingExports(500, 0, status);
    this.isExportLogVisible = true;
  }

  ngOnInit(): void {
  }

}
