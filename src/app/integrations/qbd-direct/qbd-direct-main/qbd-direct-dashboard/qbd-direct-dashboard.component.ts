import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, interval, switchMap, from, takeWhile, forkJoin, catchError, of } from 'rxjs';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { brandingConfig } from 'src/app/branding/c1-contents-config';
import { AccountingExportSummary, AccountingExportSummaryModel } from 'src/app/core/models/db/accounting-export-summary.model';
import { DestinationFieldMap, DashboardModel } from 'src/app/core/models/db/dashboard.model';
import { AccountingGroupedErrors, AccountingGroupedErrorStat, Error } from 'src/app/core/models/db/error.model';
import { AppName, AccountingErrorType, QbdDirectTaskLogType, ReimbursableImportState, CCCImportState, AppUrl, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { QbdDirectTaskResponse, QbdDirectTaskLog } from 'src/app/core/models/qbd-direct/db/qbd-direct-task-log.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { QbdDirectImportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule],
  templateUrl: './qbd-direct-dashboard.component.html',
  styleUrl: './qbd-direct-dashboard.component.scss'
})
export class QbdDirectDashboardComponent implements OnInit {

  isLoading: boolean = true;

  appName: AppName = AppName.QBD_DIRECT;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary | null;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  destinationFieldMap : DestinationFieldMap;

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  getExportErrors$: Observable<Error[]> = this.dashboardService.getExportErrors('v1');

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.accountingExportService.getAccountingExportSummary('v1');

  accountingExportType: QbdDirectTaskLogType[] = [QbdDirectTaskLogType.CREATING_BILL, QbdDirectTaskLogType.CREATING_CREDIT_CARD_PURCHASE, QbdDirectTaskLogType.CREATING_JOURNAL_ENTRY];

  accountingExportTasklogState: TaskLogState[] = [TaskLogState.IN_PROGRESS, TaskLogState.ENQUEUED, TaskLogState.EXPORT_PROCESSED];

  isImportItemsEnabled: boolean;

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  AppUrl = AppUrl;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  importCodeFields: any;

  constructor(
    private accountingExportService: AccountingExportService,
    private dashboardService: DashboardService,
    private QbdDirectExportSettingsService: QbdDirectExportSettingsService,
    private workspaceService: WorkspaceService,
    private importSettingService: QbdDirectImportSettingsService
  ) { }

  export() {
    this.isExportInProgress = true;
    this.dashboardService.triggerAccountingExport().subscribe(() => {
      this.pollExportStatus(this.exportableAccountingExportIds);
    });
  }

  private pollExportStatus(exportableAccountingExportIds: number[] = []): void {
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAllTasks([], exportableAccountingExportIds, this.accountingExportType))),
      takeWhile((response: QbdDirectTaskResponse) =>
        response.results.filter(task =>
          (this.accountingExportTasklogState.includes(task.status))
        ).length > 0, true
      )
    ).subscribe((res: QbdDirectTaskResponse) => {
      this.processedCount = res.results.filter((task: { status: TaskLogState; }) => (task.status !== TaskLogState.IN_PROGRESS && task.status !== TaskLogState.ENQUEUED)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / this.exportableAccountingExportIds.length) * 100);

      if (res.results.filter((task: { status: TaskLogState; }) => (this.accountingExportTasklogState.includes(task.status))).length === 0) {
        forkJoin([
          this.getExportErrors$,
          this.getAccountingExportSummary$
        ]).subscribe(responses => {
          this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0]);
          this.groupedErrorStat = {
            EMPLOYEE_MAPPING: null,
            CATEGORY_MAPPING: null
          };
          this.accountingExportSummary = AccountingExportSummaryModel.parseAPIResponseToAccountingSummary(responses[1]);
          this.failedExpenseGroupCount = res.results.filter(task => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

          this.exportableAccountingExportIds = res.results.filter(task => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).map(taskLog => taskLog.expense_group);

          this.isExportInProgress = false;
          this.exportProgressPercentage = 0;
          this.processedCount = 0;
        });
      }
    });
  }

  private setupPage(): void {
    forkJoin([
      this.getExportErrors$,
      this.getAccountingExportSummary$.pipe(catchError(() => of(null))),
      this.dashboardService.getAllTasks(this.accountingExportTasklogState.concat(TaskLogState.FAILED), undefined, this.accountingExportType),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.dashboardService.getExportableAccountingExportIds('v1'),
      this.QbdDirectExportSettingsService.getQbdExportSettings(),
      this.importSettingService.getImportSettings()
    ]).subscribe((responses) => {
      this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0]);
      this.isImportItemsEnabled = responses[3].import_items;
      if (responses[1]) {
        this.accountingExportSummary = AccountingExportSummaryModel.parseAPIResponseToAccountingSummary(responses[1]);
      }
      this.destinationFieldMap = {
        EMPLOYEE: responses[3].employee_field_mapping,
        CATEGORY: 'ACCOUNT'
      };

      this.isLoading = false;

      this.importCodeFields = responses[6].workspace_general_settings.import_code_fields;

      const queuedTasks: QbdDirectTaskLog[] = responses[2].results.filter((task: QbdDirectTaskLog) => this.accountingExportTasklogState.includes(task.status));
      this.failedExpenseGroupCount = responses[2].results.filter((task: QbdDirectTaskLog) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

      this.exportableAccountingExportIds = responses[4].exportable_expense_group_ids;

      this.reimbursableImportState = responses[5]?.reimbursable_expense_export_type && responses[5].reimbursable_expense_state ? this.reimbursableExpenseImportStateMap[responses[5].reimbursable_expense_state] : null;
      this.cccImportState = responses[5].credit_card_expense_export_type && responses[5].credit_card_expense_state ? this.cccExpenseImportStateMap[responses[5].credit_card_expense_state] : null;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
        this.pollExportStatus(this.exportableAccountingExportIds);
      } else {
        this.accountingExportService.importExpensesFromFyle('v1').subscribe(() => {
          this.dashboardService.getExportableAccountingExportIds('v1').subscribe((exportableAccountingExportIds) => {
            this.exportableAccountingExportIds = exportableAccountingExportIds.exportable_expense_group_ids;
            this.isImportInProgress = false;
          });
        });
      }
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
