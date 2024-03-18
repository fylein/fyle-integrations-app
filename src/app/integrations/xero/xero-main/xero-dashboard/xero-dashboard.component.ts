import { Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, from, interval, of, switchMap, takeWhile } from 'rxjs';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AccountingExportSummary, AccountingExportSummaryModel } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel, DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { AccountingErrorType, AccountingField, AppName, AppUrl, CCCExpenseState, CCCImportState, ExpenseState, ExportState, FyleReferenceType, ReimbursableImportState, TaskLogState, TaskLogType, XeroCorporateCreditCardExpensesObject, XeroReimbursableExpensesObject, XeroTaskLogType } from 'src/app/core/models/enum/enum.model';
import { ExpenseGroupList } from 'src/app/core/models/intacct/db/expense-group.model';
import { XeroTaskLog, XeroTaskResponse } from 'src/app/core/models/xero/db/xero-task-log.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { XeroExportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-export-settings.service';
import { AccountingGroupedErrorStat, AccountingGroupedErrors, Error } from 'src/app/core/models/db/error.model';
@Component({
  selector: 'app-xero-dashboard',
  templateUrl: './xero-dashboard.component.html',
  styleUrls: ['./xero-dashboard.component.scss']
})
export class XeroDashboardComponent implements OnInit {

  isLoading: boolean = true;

  AppUrl = AppUrl;

  appName: AppName = AppName.XERO;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary | null;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  groupedError: Error[];

  expenseGroupSetting: string;

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  ExportState = ExportState;

  importState: ExpenseState;

  ExpenseState = ExpenseState;

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  getExportErrors$: Observable<Error[]> = this.dashboardService.getExportErrors('v1');

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.accountingExportService.getAccountingExportSummary('v1');

  accountingExportType: XeroTaskLogType[] = [XeroTaskLogType.FETCHING_EXPENSE, XeroTaskLogType.CREATING_BILL, XeroTaskLogType.CREATING_BANK_TRANSACTION];

  destinationFieldMap : DestinationFieldMap;

  readonly brandingConfig = brandingConfig;

  illustrationsAllowed: boolean = brandingFeatureConfig.illustrationsAllowed;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    private dashboardService: DashboardService,
    private accountingExportService: AccountingExportService,
    private exportLogService: ExportLogService,
    private userService: UserService,
    private workspaceService: WorkspaceService,
    private xeroExportSettingService: XeroExportSettingsService
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
      takeWhile((response: XeroTaskResponse) =>
      response.results.filter(task =>
        (task.status === TaskLogState.IN_PROGRESS || task.status === TaskLogState.ENQUEUED)
      ).length > 0, true
    )
  ).subscribe((res: XeroTaskResponse) => {
    this.processedCount = res.results.filter(task => (task.status !== TaskLogState.IN_PROGRESS && task.status !== TaskLogState.ENQUEUED)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / exportableAccountingExportIds.length) * 100);

      if (res.results.filter(task => (task.status === TaskLogState.IN_PROGRESS || task.status === TaskLogState.ENQUEUED)).length === 0) {
      forkJoin([
        this.getExportErrors$,
        this.getAccountingExportSummary$.pipe(catchError(() => of(null)))
      ]).subscribe(responses => {
        this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0]);
        this.groupedErrorStat = {
          EMPLOYEE_MAPPING: null,
          CATEGORY_MAPPING: null
        };

        if (responses[1]) {
          this.accountingExportSummary = AccountingExportSummaryModel.parseAPIResponseToAccountingSummary(responses[1]);
        }

        this.failedExpenseGroupCount = res.results.filter((task: { status: TaskLogState; }) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

        this.exportableAccountingExportIds = res.results.filter((task: { status: TaskLogState; }) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).map((taskLog: { expense_group: any; }) => taskLog.expense_group);

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
      this.dashboardService.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], undefined, this.accountingExportType, AppName.XERO),
      this.dashboardService.getExportableAccountingExportIds('v1'),
      this.xeroExportSettingService.getExportSettings()
    ]).subscribe((responses) => {
      this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0]);
      this.reimbursableImportState = responses[4].workspace_general_settings?.reimbursable_expenses_object ? this.reimbursableExpenseImportStateMap[ExpenseState.PAID] : null;
      this.cccImportState = responses[4].workspace_general_settings?.corporate_credit_card_expenses_object ? this.cccExpenseImportStateMap[CCCExpenseState.APPROVED] : null;

      if (responses[1]) {
        this.accountingExportSummary = AccountingExportSummaryModel.parseAPIResponseToAccountingSummary(responses[1]);
      }

      this.destinationFieldMap = {
        EMPLOYEE: AccountingField.CONTACT,
        CATEGORY: AccountingField.ACCOUNT
      };

      this.isLoading = false;

      const queuedTasks: XeroTaskLog[] = responses[2].results.filter((task: XeroTaskLog) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[2].results.filter((task: XeroTaskLog) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

      this.exportableAccountingExportIds = responses[3].exportable_expense_group_ids;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
        this.pollExportStatus();
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
