import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, forkJoin, from, interval, of, switchMap, takeUntil, takeWhile } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AccountingExportSummary, AccountingExportSummaryModel } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel, DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { AccountingGroupedErrorStat, AccountingGroupedErrors, Error, ErrorResponse } from 'src/app/core/models/db/error.model';
import { AccountingErrorType, AppName, AppUrl, CCCExpenseState, CCCImportState, ExpenseState, QBOTaskLogType, ReimbursableImportState, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { QBOTaskLog, QBOTaskResponse } from 'src/app/core/models/qbo/db/qbo-task-log.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';

@Component({
  selector: 'app-qbo-dashboard',
  templateUrl: './qbo-dashboard.component.html',
  styleUrls: ['./qbo-dashboard.component.scss']
})
export class QboDashboardComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  isQBOTokenNotValid: boolean = false;

  appName: AppName = AppName.QBO;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary | null;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  destinationFieldMap : DestinationFieldMap;

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent.dashboard;

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };
  
  getExportErrors$: Observable<Error[]> = this.dashboardService.getExportErrors('v1');

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.accountingExportService.getAccountingExportSummary('v1');

  accountingExportType: QBOTaskLogType[] = [QBOTaskLogType.FETCHING_EXPENSE, QBOTaskLogType.CREATING_BILL, QBOTaskLogType.CREATING_EXPENSE, QBOTaskLogType.CREATING_CHECK, QBOTaskLogType.CREATING_CREDIT_CARD_PURCHASE, QBOTaskLogType.CREATING_JOURNAL_ENTRY, QBOTaskLogType.CREATING_CREDIT_CARD_CREDIT, QBOTaskLogType.CREATING_DEBIT_CARD_EXPENSE];

  isImportItemsEnabled: boolean;

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  AppUrl = AppUrl;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  importCodeFields: any;

  private destroy$ = new Subject<void>(); // Why this subject? -> to stop polling when the component is destroyed/page closed.

  constructor(
    private accountingExportService: AccountingExportService,
    private dashboardService: DashboardService,
    private qboExportSettingsService: QboExportSettingsService,
    private workspaceService: WorkspaceService,
    private importSettingService: QboImportSettingsService,
    private router: Router
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
      takeUntil(this.destroy$),
      takeWhile((response: QBOTaskResponse) =>
        response.results.filter(task =>
          (task.status === TaskLogState.IN_PROGRESS || task.status === TaskLogState.ENQUEUED)
        ).length > 0, true
      )
    ).subscribe((res: QBOTaskResponse) => {
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
      this.dashboardService.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], undefined, this.accountingExportType),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.dashboardService.getExportableAccountingExportIds('v1'),
      this.qboExportSettingsService.getExportSettings(),
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

      this.importCodeFields = responses[6].workspace_general_settings?.import_code_fields;

      const queuedTasks: QBOTaskLog[] = responses[2].results.filter((task: QBOTaskLog) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[2].results.filter((task: QBOTaskLog) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

      this.exportableAccountingExportIds = responses[4].exportable_expense_group_ids;

      this.reimbursableImportState = responses[5].workspace_general_settings.reimbursable_expenses_object ? this.reimbursableExpenseImportStateMap[responses[5].expense_group_settings.expense_state] : null;
      this.cccImportState = responses[5].workspace_general_settings.corporate_credit_card_expenses_object ? this.cccExpenseImportStateMap[responses[5].expense_group_settings.ccc_expense_state] : null;

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

    if (this.router.url.includes("/token_expired/") || this.router.url.includes("/disconnect/")){
      this.isQBOTokenNotValid = true;
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
