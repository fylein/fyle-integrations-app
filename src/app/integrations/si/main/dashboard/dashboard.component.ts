import { Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, from, interval, map, of, switchMap, takeWhile } from 'rxjs';
import { AppName, ClickEvent, ExpenseState, ExportState, FyleField, FyleReferenceType, IntacctErrorType, RefinerSurveyType, TaskLogState, TaskLogType } from 'src/app/core/models/enum/enum.model';
import { Error, GroupedErrorStat, GroupedErrors } from 'src/app/core/models/si/db/error.model';
import { ExpenseGroupSetting } from 'src/app/core/models/si/db/expense-group-setting.model';
import { ExpenseGroup, ExpenseGroupList, ExportableExpenseGroup } from 'src/app/core/models/si/db/expense-group.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';
import { LastExport } from 'src/app/core/models/si/db/last-export.model';
import { Task } from 'src/app/core/models/si/db/task-log.model';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { ExportLogService } from 'src/app/core/services/si/export-log/export-log.service';
import { DashboardService } from 'src/app/core/services/si/si-core/dashboard.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoading: boolean = false;

  importInProgress: boolean = true;

  isExportLogVisible: boolean = false;

  isMappingResolveVisible: boolean = false;

  intacctErrorDialogVisible: boolean = false;

  intacctErrorExpenses: Expense[] = [];

  intacctErrorDetail: string;

  taskLogStatusComplete: TaskLogState = TaskLogState.COMPLETE;

  taskLogStatusFailed: TaskLogState = TaskLogState.FAILED;

  exportLogHeader: string;

  processedCount: number = 0;

  failedExpenseGroupCount: number | null = null;

  exportInProgress: boolean = false;

  exportProgressPercentage: number = 0;

  exportableExpenseGroupIds: number[] = [];

  lastExport: LastExport | null;

  errors: GroupedErrors;

  employeeFieldMapping: FyleField;

  expenseGroupSetting: string;

  expenseGroups: ExpenseGroupList [];

  groupedErrorStat: GroupedErrorStat = {
    [IntacctErrorType.EMPLOYEE_MAPPING]: null,
    [IntacctErrorType.CATEGORY_MAPPING]: null
  };

  ExportState = ExportState;

  importState: ExpenseState;

  ExpenseState = ExpenseState;

  employeeName: string = this.userService.getUserProfile().full_name;

  intacctErrorType: IntacctErrorType;

  IntacctErrorType = IntacctErrorType;

  getExportErrors$: Observable<Error[]> = this.dashboardService.getExportErrors();

  getLastExport$: Observable<LastExport> = this.dashboardService.getLastExport();

  private taskType: TaskLogType[] = [TaskLogType.FETCHING_EXPENSES, TaskLogType.CREATING_BILLS, TaskLogType.CREATING_CHARGE_CARD_TRANSACTIONS, TaskLogType.CREATING_JOURNAL_ENTRIES, TaskLogType.CREATING_EXPENSE_REPORTS];

  constructor(
    private dashboardService: DashboardService,
    private exportLogService: ExportLogService,
    private refinerService: RefinerService,
    private trackingService: TrackingService,
    private userService: UserService,
    private workspaceService: SiWorkspaceService
  ) { }

  showMappingResolve(errorType: IntacctErrorType) {
    this.intacctErrorType = errorType;
    this.isMappingResolveVisible = true;
  }

  showIntacctErrorDialog(intacctError: Error) {
    this.intacctErrorDialogVisible = true;
    this.intacctErrorDetail = intacctError.error_detail;
    this.intacctErrorExpenses = intacctError.expense_group.expenses;
  }

  openUrl(event: Event, url: string) {
    window.open(url, '_blank');
    event.stopPropagation();
  }

  showExportLog(status: TaskLogState) {
    this.exportLogHeader = status === this.taskLogStatusComplete ? 'Successful' : 'Failed';
    this.getExpenseGroups(500, 0, status);
    this.isExportLogVisible = true;
  }

  getExpenseGroups(limit: number, offset: number, status: TaskLogState) {
    const expenseGroups: ExpenseGroupList[] = [];
    const exportedAt = status === TaskLogState.COMPLETE ? this.lastExport?.last_exported_at : null;

    return this.exportLogService.getExpenseGroups(status===TaskLogState.COMPLETE ? TaskLogState.COMPLETE : TaskLogState.FAILED, limit, offset, null, exportedAt).subscribe(expenseGroupResponse => {
      expenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup) => {
        const referenceType: FyleReferenceType = this.exportLogService.getReferenceType(expenseGroup.description);
        expenseGroups.push({
          exportedAt: (status===TaskLogState.COMPLETE ? expenseGroup.exported_at : expenseGroup.updated_at),
          employee: [expenseGroup.employee_name, expenseGroup.description.employee_email],
          referenceNumber: expenseGroup.description.claim_number,
          exportedAs: expenseGroup.export_type,
          expenses: expenseGroup.expenses,
          fyleUrl: this.exportLogService.generateFyleUrl(expenseGroup, referenceType),
        });
      });
      this.expenseGroups = expenseGroups;
    });
  }

  private pollExportStatus(exportableExpenseGroupIds: number[] = []): void {
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAllTasks([], exportableExpenseGroupIds, this.taskType))),
      takeWhile((response) => response.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && exportableExpenseGroupIds.includes(task.expense_group)).length > 0, true)
    ).subscribe((res) => {
      this.processedCount = res.results.filter(task => (task.status !== 'IN_PROGRESS' && task.status !== 'ENQUEUED') && (task.type !== TaskLogType.FETCHING_EXPENSES && task.type !== TaskLogType.CREATING_AP_PAYMENT && task.type !== TaskLogType.CREATING_REIMBURSEMENT) && exportableExpenseGroupIds.includes(task.expense_group)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / exportableExpenseGroupIds.length) * 100);

      if (res.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED') && exportableExpenseGroupIds.includes(task.expense_group)).length === 0) {
        this.isLoading = true;
        forkJoin([
          this.getExportErrors$,
          this.getLastExport$
        ]).subscribe(responses => {
          this.errors = this.formatErrors(responses[0]);
          this.groupedErrorStat = {
            EMPLOYEE_MAPPING: null,
            CATEGORY_MAPPING: null
          };
          this.lastExport = responses[1];
          this.isLoading = false;
        });
        this.dashboardService.getAllTasks([TaskLogState.FAILED, TaskLogState.FATAL], undefined, this.taskType).subscribe((taskResponse) => {
          this.failedExpenseGroupCount = taskResponse.count;
          this.exportableExpenseGroupIds = taskResponse.results.map((task: Task) => task.expense_group);
          this.exportInProgress = false;
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

  private formatErrors(errors: Error[]): GroupedErrors {
    return errors.reduce((groupedErrors: GroupedErrors, error: Error) => {
      const group: Error[] = groupedErrors[error.type] || [];
      group.push(error);
      groupedErrors[error.type] = group;

      return groupedErrors;
    }, {
      [IntacctErrorType.EMPLOYEE_MAPPING]: [],
      [IntacctErrorType.CATEGORY_MAPPING]: [],
      [IntacctErrorType.INTACCT_ERROR]: []
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
      this.getLastExport$.pipe(map((res) => res), catchError(() => of(null))),
      this.getExportErrors$,
      this.workspaceService.getConfiguration(),
      this.dashboardService.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], undefined, this.taskType),
      this.exportLogService.getExpenseGroupSettings()
    ]).subscribe((responses) => {
      this.lastExport = responses[0];
      this.errors = this.formatErrors(responses[1]);
      this.employeeFieldMapping = responses[2].employee_field_mapping;
      this.expenseGroupSetting = this.getExpenseGroupingSetting(responses[4]);
      this.importState = responses[4].expense_state;

      const queuedTasks: Task[] = responses[3].results.filter((task: Task) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[3].results.filter((task: Task) => task.status === TaskLogState.FAILED).length;

      if (queuedTasks.length) {
        this.importInProgress = false;
        this.exportInProgress = true;
        this.exportableExpenseGroupIds = responses[3].results.filter((task: Task) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS).map((task: Task) => task.expense_group);
        this.pollExportStatus(this.exportableExpenseGroupIds);
      } else {
        this.dashboardService.importExpenseGroups().subscribe(() => {
          this.dashboardService.getExportableGroupsIds().subscribe((exportableExpenseGroups: ExportableExpenseGroup) => {
            this.exportableExpenseGroupIds = exportableExpenseGroups.exportable_expense_group_ids;
            this.importInProgress = false;
          });
        });
      }
      this.isLoading = false;
    });
  }

  export(): void {
    if (!this.exportInProgress && this.exportableExpenseGroupIds.length) {
      this.exportInProgress = true;
      this.trackingService.onClickEvent(ClickEvent.INTACCT_EXPORT);
      this.dashboardService.exportExpenseGroups().subscribe(() => {
        this.pollExportStatus(this.exportableExpenseGroupIds);
      });
    }
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
