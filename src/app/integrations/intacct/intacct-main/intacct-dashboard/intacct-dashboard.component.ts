import { Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, from, interval, map, of, switchMap, takeWhile } from 'rxjs';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AccountingErrorType, AppName, AppUrl, CCCImportState, ClickEvent, ExpenseState, ExportState, FyleField, FyleReferenceType, IntacctErrorType, RefinerSurveyType, ReimbursableImportState, TaskLogState, TaskLogType, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { ExpenseGroupSetting } from 'src/app/core/models/db/expense-group-setting.model';
import { ExpenseGroup, ExpenseGroupList, ExportableExpenseGroup } from 'src/app/core/models/intacct/db/expense-group.model';
import { Expense } from 'src/app/core/models/intacct/db/expense.model';
import { LastExport } from 'src/app/core/models/intacct/db/last-export.model';
import { Task } from 'src/app/core/models/intacct/db/task-log.model';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { ExportLogService } from 'src/app/core/services/si/export-log/export-log.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { environment } from 'src/environments/environment';
import { AccountingExportSummary, AccountingExportSummaryModel } from 'src/app/core/models/db/accounting-export-summary.model';
import { AccountingGroupedErrorStat, AccountingGroupedErrors, Error } from 'src/app/core/models/db/error.model';
import { DashboardModel, DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';

@Component({
  selector: 'app-intacct-dashboard',
  templateUrl: './intacct-dashboard.component.html',
  styleUrls: ['./intacct-dashboard.component.scss']
})
export class IntacctDashboardComponent implements OnInit {

  isLoading: boolean = false;

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

  employeeFieldMapping: FyleField;

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
    private refinerService: RefinerService,
    private trackingService: TrackingService,
    private userService: UserService,
    private workspaceService: SiWorkspaceService
  ) { }

  export() {
    this.isExportInProgress = true;
    this.dashboardService.triggerAccountingExport().subscribe(() => {
      this.pollExportStatus(this.exportableAccountingExportIds);
    });
  }

  getExpenseGroups(limit: number, offset: number, status: TaskLogState) {
    const expenseGroups: ExpenseGroupList[] = [];
    const exportedAt = status === TaskLogState.COMPLETE ? this.lastExport?.last_exported_at : null;

    return this.exportLogService.getExpenseGroups(status===TaskLogState.COMPLETE ? TaskLogState.COMPLETE : TaskLogState.FAILED, limit, offset, null, exportedAt).subscribe(expenseGroupResponse => {
      expenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup) => {
        const referenceType: FyleReferenceType = this.exportLogService.getReferenceType(expenseGroup.description);

        let referenceNumber: string = expenseGroup.description[referenceType];

        if (referenceType === FyleReferenceType.EXPENSE) {
          referenceNumber = expenseGroup.expenses[0].expense_number;
        } else if (referenceType === FyleReferenceType.PAYMENT) {
          referenceNumber = expenseGroup.expenses[0].payment_number;
        }

        expenseGroups.push({
          exportedAt: (status===TaskLogState.COMPLETE ? expenseGroup.exported_at : expenseGroup.updated_at),
          employee: [expenseGroup.employee_name, expenseGroup.description.employee_email],
          referenceNumber: referenceNumber,
          exportedAs: expenseGroup.export_type,
          expenses: expenseGroup.expenses,
          fyleUrl: this.exportLogService.generateFyleUrl(expenseGroup, referenceType),
          intacctUrl: `https://www-p02.intacct.com/ia/acct/ur.phtml?.r=${expenseGroup.response_logs?.url_id}`
        });
      });
      this.expenseGroups = expenseGroups;
    });
  }

  private pollExportStatus(exportableAccountingExportIds: number[] = []): void {
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAllTasks([], exportableAccountingExportIds, this.accountingExportType))),
      takeWhile((response) => response.results.filter((task: { status: string; expense_group: number; }) => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && exportableAccountingExportIds.includes(task.expense_group)).length > 0, true)
    ).subscribe((res) => {
      this.processedCount = res.results.filter((task: { status: string; type: TaskLogType; expense_group: number; }) => (task.status !== 'IN_PROGRESS' && task.status !== 'ENQUEUED') && (task.type !== TaskLogType.FETCHING_EXPENSES && task.type !== TaskLogType.CREATING_AP_PAYMENT && task.type !== TaskLogType.CREATING_REIMBURSEMENT) && exportableAccountingExportIds.includes(task.expense_group)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / exportableAccountingExportIds.length) * 100);

      if (res.results.filter((task: { status: string; expense_group: number; }) => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && exportableAccountingExportIds.includes(task.expense_group)).length === 0) {
        this.isLoading = true;
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
          this.isLoading = false;
        });
        this.dashboardService.getAllTasks([TaskLogState.FAILED, TaskLogState.FATAL], undefined, this.accountingExportType).subscribe((taskResponse) => {
          this.failedExpenseGroupCount = taskResponse.count;
          this.exportableAccountingExportIds = taskResponse.results.map((task: Task) => task.expense_group);
          this.isExportInProgress = false;
          this.exportProgressPercentage = 0;
          this.processedCount = 0;

          if (this.failedExpenseGroupCount === 0) {
            this.refinerService.triggerSurvey(
              AppName.INTACCT, environment.refiner_survey.intacct.export_done_survery_id, RefinerSurveyType.EXPORT_DONE
            );
          }
        });
      }
    });
  }

  private getExpenseGroupingSetting(expenseGroupSetting: ExpenseGroupSetting): string {
    const grouping: string[] = expenseGroupSetting.reimbursable_expense_group_fields ? expenseGroupSetting.reimbursable_expense_group_fields : expenseGroupSetting.corporate_credit_card_expense_group_fields;
    if (grouping.includes(FyleReferenceType.EXPENSE)) {
      return 'expense';
    } else if (grouping.includes(FyleReferenceType.REPORT_ID)) {
      return 'report';
    } else if (grouping.includes(FyleReferenceType.PAYMENT)) {
      return 'payment';
    }

    return '';
  }

  private setupPage(): void {
    forkJoin([
      this.getExportErrors$,
      this.getAccountingExportSummary$.pipe(catchError(() => of(null))),
      this.dashboardService.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], undefined, this.accountingExportType),
      this.workspaceService.getConfiguration(),
      this.exportLogService.getExpenseGroupSettings()
    ]).subscribe((responses) => {
      this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0]);
      this.employeeFieldMapping = responses[3].employee_field_mapping;
      this.expenseGroupSetting = this.getExpenseGroupingSetting(responses[4]);
      this.importState = responses[4].expense_state;

      const queuedTasks: Task[] = responses[2].results.filter((task: Task) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[2].results.filter((task: Task) => task.status === TaskLogState.FAILED).length;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
        this.exportableAccountingExportIds = responses[2].results.filter((task: Task) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS).map((task: Task) => task.expense_group);
        this.pollExportStatus(this.exportableAccountingExportIds);
      } else {
        this.accountingExportService.importExpensesFromFyle('v1').subscribe(() => {
          this.dashboardService.getExportableAccountingExportIds('v1').subscribe((exportableAccountingExportIds) => {
            this.exportableAccountingExportIds = exportableAccountingExportIds.exportable_expense_group_ids;
            this.isImportInProgress = false;
          });
        });
      }
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
