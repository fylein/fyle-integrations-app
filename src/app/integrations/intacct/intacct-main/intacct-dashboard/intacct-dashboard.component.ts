import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { Observable } from 'rxjs';
import { catchError, forkJoin, from, interval, map, of, switchMap, takeWhile } from 'rxjs';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import type { CCCImportState, ReimbursableImportState } from 'src/app/core/models/enum/enum.model';
import { AccountingErrorType, AppName, AppUrl, ClickEvent, ExpenseState, ExportState, FyleField, FyleReferenceType, IntacctCategoryDestination, IntacctCorporateCreditCardExpensesObject, IntacctErrorType, IntacctReimbursableExpensesObject, RefinerSurveyType, TaskLogState, TaskLogType, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { ExpenseGroupSetting } from 'src/app/core/models/db/expense-group-setting.model';
import type { ExpenseGroupList } from 'src/app/core/models/intacct/db/expense-group.model';
import { ExpenseGroup, ExportableExpenseGroup } from 'src/app/core/models/intacct/db/expense-group.model';
import { Expense } from 'src/app/core/models/intacct/db/expense.model';
import type { LastExport } from 'src/app/core/models/intacct/db/last-export.model';
import type { IntacctTaskLog, IntacctTaskResponse } from 'src/app/core/models/intacct/db/task-log.model';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import type { UserService } from 'src/app/core/services/misc/user.service';
import type { ExportLogService } from 'src/app/core/services/si/export-log/export-log.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { environment } from 'src/environments/environment';
import type { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { AccountingExportSummaryModel } from 'src/app/core/models/db/accounting-export-summary.model';
import type { AccountingGroupedErrorStat, AccountingGroupedErrors, Error } from 'src/app/core/models/db/error.model';
import type { DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { DashboardModel } from 'src/app/core/models/db/dashboard.model';
import type { DashboardService } from 'src/app/core/services/common/dashboard.service';
import type { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import type { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';

@Component({
  selector: 'app-intacct-dashboard',
  templateUrl: './intacct-dashboard.component.html',
  styleUrls: ['./intacct-dashboard.component.scss']
})
export class IntacctDashboardComponent implements OnInit {

  isLoading: boolean = true;

  AppUrl = AppUrl;

  appName: AppName = AppName.INTACCT;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary | null;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  groupedError: Error[];

  lastExport: LastExport | null;

  expenseGroupSetting: string;

  expenseGroups: ExpenseGroupList [];

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  ExportState = ExportState;

  importState: ExpenseState;

  ExpenseState = ExpenseState;

  employeeName: string = this.userService.getUserProfile().full_name;

  intacctErrorType: IntacctErrorType;

  IntacctErrorType = IntacctErrorType;

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  getExportErrors$: Observable<Error[]> = this.dashboardService.getExportErrors('v1');

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.accountingExportService.getAccountingExportSummary('v1');

  accountingExportType: TaskLogType[] = [TaskLogType.CREATING_BILLS, TaskLogType.CREATING_CHARGE_CARD_TRANSACTIONS, TaskLogType.CREATING_JOURNAL_ENTRIES, TaskLogType.CREATING_EXPENSE_REPORTS];

  destinationFieldMap : DestinationFieldMap;

  readonly dummyExpenseGroupList: ExpenseGroupList[] = [{
    index: 0,
    exportedAt: new Date(),
    employee: ['a', 'b'],
    expenseType: 'Corporate Card',
    referenceNumber: '123',
    exportedAs: 'a',
    intacctUrl: 'a',
    fyleUrl: 'a',
    fyleReferenceType: FyleReferenceType.EXPENSE,
    expenses: []
  }];

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
    private intacctExportSettingService: SiExportSettingService
  ) { }

  export() {
    this.isExportInProgress = true;
    this.dashboardService.triggerAccountingExport().subscribe(() => {
      this.pollExportStatus(this.exportableAccountingExportIds);
    });
  }

  private pollExportStatus(exportableAccountingExportIds: number[] = []): void {
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAllTasks([], exportableAccountingExportIds, this.accountingExportType, AppName.INTACCT))),
      takeWhile((response: IntacctTaskResponse) =>
      response.results.filter(task =>
        (task.status === TaskLogState.IN_PROGRESS || task.status === TaskLogState.ENQUEUED)
      ).length > 0, true)
    ).subscribe((res: IntacctTaskResponse) => {
      this.processedCount = res.results.filter((task: { status: string; type: TaskLogType; expense_group: number; }) => (task.status !== 'IN_PROGRESS' && task.status !== 'ENQUEUED') && (task.type !== TaskLogType.FETCHING_EXPENSES && task.type !== TaskLogType.CREATING_AP_PAYMENT && task.type !== TaskLogType.CREATING_REIMBURSEMENT) && exportableAccountingExportIds.includes(task.expense_group)).length;
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
      this.dashboardService.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], undefined, this.accountingExportType, AppName.INTACCT),
      this.workspaceService.getConfiguration(),
      this.dashboardService.getExportableAccountingExportIds('v1'),
      this.intacctExportSettingService.getExportSettings()
    ]).subscribe((responses) => {
      this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0]);
      this.reimbursableImportState = responses[5].configurations?.reimbursable_expenses_object ? this.reimbursableExpenseImportStateMap[responses[5].expense_group_settings.expense_state] : null;
      this.cccImportState = responses[5].configurations?.corporate_credit_card_expenses_object ? this.cccExpenseImportStateMap[responses[5].expense_group_settings.ccc_expense_state] : null;

      if (responses[1]) {
        this.accountingExportSummary = AccountingExportSummaryModel.parseAPIResponseToAccountingSummary(responses[1]);
      }

      this.destinationFieldMap = {
        EMPLOYEE: responses[3].employee_field_mapping,
        CATEGORY: (responses[3].reimbursable_expenses_object === IntacctReimbursableExpensesObject.EXPENSE_REPORT || responses[3].corporate_credit_card_expenses_object === IntacctCorporateCreditCardExpensesObject.EXPENSE_REPORT) ? IntacctCategoryDestination.EXPENSE_TYPE : IntacctCategoryDestination.ACCOUNT
      };

      this.isLoading = false;

      const queuedTasks: IntacctTaskLog[] = responses[2].results.filter((task: IntacctTaskLog) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[2].results.filter((task: IntacctTaskLog) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

      this.exportableAccountingExportIds = responses[4].exportable_expense_group_ids;

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
