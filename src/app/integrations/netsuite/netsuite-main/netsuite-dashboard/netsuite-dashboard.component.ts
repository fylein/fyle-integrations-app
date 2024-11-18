import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, from, interval, of, switchMap, takeWhile } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AccountingExportSummary, AccountingExportSummaryModel } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel, DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { AccountingGroupedErrorStat, AccountingGroupedErrors, Error } from 'src/app/core/models/db/error.model';
import { AppName, ReimbursableImportState, CCCImportState, AccountingErrorType, AppUrl, NetsuiteTaskLogType, TaskLogState, NetsuiteReimbursableExpensesObject, NetSuiteCorporateCreditCardExpensesObject, NetsuiteCategoryDestination } from 'src/app/core/models/enum/enum.model';
import { NetsuiteTaskLog, NetsuiteTaskResponse } from 'src/app/core/models/netsuite/db/netsuite-task-log.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';

@Component({
  selector: 'app-netsuite-dashboard',
  templateUrl: './netsuite-dashboard.component.html',
  styleUrls: ['./netsuite-dashboard.component.scss']
})
export class NetsuiteDashboardComponent implements OnInit {

  isLoading: boolean = true;

  appName: AppName = AppName.NETSUITE;

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

  accountingExportType: NetsuiteTaskLogType[] = [NetsuiteTaskLogType.CREATING_BILL, NetsuiteTaskLogType.CREATING_EXPENSE_REPORT, NetsuiteTaskLogType.CREATING_CREDIT_CARD_CHARGE, NetsuiteTaskLogType.CREATING_CREDIT_CARD_REFUND, NetsuiteTaskLogType.CREATING_JOURNAL_ENTRY];

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  AppUrl = AppUrl;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  constructor(
    private accountingExportService: AccountingExportService,
    private dashboardService: DashboardService,
    private netsuiteExportSettingsService: NetsuiteExportSettingsService,
    private workspaceService: WorkspaceService
  ) { }

  export() {
    this.isExportInProgress = true;
    this.dashboardService.triggerAccountingExport().subscribe(() => {
      this.pollExportStatus(this.exportableAccountingExportIds);
    });
  }

  private pollExportStatus(exportableAccountingExportIds: number[] = []): void {
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAllTasks([], exportableAccountingExportIds, this.accountingExportType, this.appName))),
      takeWhile((response: NetsuiteTaskResponse) =>
        response.results.filter(task =>
          (task.status === TaskLogState.IN_PROGRESS || task.status === TaskLogState.ENQUEUED)
        ).length > 0, true
      )
    ).subscribe((res: NetsuiteTaskResponse) => {
      this.processedCount = res.results.filter(task => (task.status !== TaskLogState.IN_PROGRESS && task.status !== TaskLogState.ENQUEUED)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / this.exportableAccountingExportIds.length) * 100);

      if (res.results.filter(task => (task.status === TaskLogState.IN_PROGRESS || task.status === TaskLogState.ENQUEUED)).length === 0) {
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
      this.dashboardService.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], undefined, this.accountingExportType, this.appName),
      this.dashboardService.getExportableAccountingExportIds('v1'),
      this.netsuiteExportSettingsService.getExportSettings()
    ]).subscribe((responses) => {
      this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0]);
      if (responses[1]) {
        this.accountingExportSummary = AccountingExportSummaryModel.parseAPIResponseToAccountingSummary(responses[1]);
      }
      this.destinationFieldMap = {
        EMPLOYEE: responses[4].configuration.employee_field_mapping,
        CATEGORY: (responses[4].configuration.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.EXPENSE_REPORT || responses[4].configuration.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.EXPENSE_REPORT) ? NetsuiteCategoryDestination.EXPENSE_CATEGORY : NetsuiteCategoryDestination.ACCOUNT
      };

      this.isLoading = false;

      const queuedTasks: NetsuiteTaskLog[] = responses[2].results.filter((task: NetsuiteTaskLog) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[2].results.filter((task: NetsuiteTaskLog) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

      this.exportableAccountingExportIds = responses[3].exportable_expense_group_ids;

      this.reimbursableImportState = responses[4].configuration.reimbursable_expenses_object ? this.reimbursableExpenseImportStateMap[responses[4].expense_group_settings.expense_state] : null;
      this.cccImportState = responses[4].configuration.corporate_credit_card_expenses_object ? this.cccExpenseImportStateMap[responses[4].expense_group_settings.ccc_expense_state] : null;

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
