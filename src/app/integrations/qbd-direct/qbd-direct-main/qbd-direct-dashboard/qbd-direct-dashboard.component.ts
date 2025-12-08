import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, interval, switchMap, from, takeWhile, forkJoin, catchError, of, Subject, takeUntil } from 'rxjs';
import { brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { brandingConfig } from 'src/app/branding/branding-config';
import { AccountingExportSummary, AccountingExportSummaryModel } from 'src/app/core/models/db/accounting-export-summary.model';
import { DestinationFieldMap, DashboardModel } from 'src/app/core/models/db/dashboard.model';
import { AccountingGroupedErrors, AccountingGroupedErrorStat, ErrorResponse } from 'src/app/core/models/db/error.model';
import { AppName, AccountingErrorType, ReimbursableImportState, CCCImportState, AppUrl, TaskLogState, ClickEvent, TrackingApp, RefinerSurveyType } from 'src/app/core/models/enum/enum.model';
import { QbdDirectTaskResponse, QbdDirectTaskLog } from 'src/app/core/models/qbd-direct/db/qbd-direct-task-log.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { QbdDirectImportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.service';
import { QbdDirectAdvancedSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { QbdDirectMappingService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-mapping.service';

@Component({
    selector: 'app-qbd-direct-dashboard',
    imports: [RouterModule, CommonModule, SharedModule, TranslocoModule],
    templateUrl: './qbd-direct-dashboard.component.html',
    styleUrl: './qbd-direct-dashboard.component.scss'
})
export class QbdDirectDashboardComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  appName: AppName = AppName.QBD_DIRECT;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary | null;

  isRealTimeExportEnabled: boolean = false;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  destinationFieldMap : DestinationFieldMap;

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  getExportErrors$: Observable<ErrorResponse> = this.dashboardService.getExportErrors(AppName.QBD_DIRECT);

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.accountingExportService.getAccountingExportSummary(AppName.QBD_DIRECT, brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary, AppName.QBD_DIRECT);

  exportLogProcessingStates: TaskLogState[] = [TaskLogState.IN_PROGRESS, TaskLogState.ENQUEUED, TaskLogState.EXPORT_PROCESSED];

  isImportItemsEnabled: boolean;

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  AppUrl = AppUrl;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingConfig = brandingConfig;

  importCodeFields: any;

  chartOfAccounts: string[];

  isEmployeeAndVendorAllowed: boolean = false;

  private destroy$ = new Subject<void>();

  redirectLink: string = brandingKbArticles.onboardingArticles.QBD_DIRECT.ERROR_RESOLUTION_GUIDE_LINK;

  constructor(
    private accountingExportService: AccountingExportService,
    private dashboardService: DashboardService,
    private QbdDirectExportSettingsService: QbdDirectExportSettingsService,
    private trackingService: TrackingService,
    private importSettingService: QbdDirectImportSettingsService,
    private refinerService: RefinerService,
    private qbdDirectAdvancedSettingsService: QbdDirectAdvancedSettingsService,
    private qbdDirectMappingService: QbdDirectMappingService,
    private translocoService: TranslocoService
  ) { }

  export() {
    this.isExportInProgress = true;
    this.trackingService.onClickEvent(TrackingApp.QBD_DIRECT, ClickEvent.QBD_DIRECT_EXPORT);
    this.dashboardService.triggerAccountingExport('v1').subscribe(() => {
      this.pollExportStatus(this.exportableAccountingExportIds);
    });
  }

  private pollExportStatus(exportableAccountingExportIds: number[] = []): void {
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAllTasks([], exportableAccountingExportIds, [], AppName.QBD_DIRECT))),
      takeUntil(this.destroy$),
      takeWhile((response: QbdDirectTaskResponse) =>
        response.results.filter(task =>
          (this.exportLogProcessingStates.includes(task.status))
        ).length > 0, true
      )
    ).subscribe((res: QbdDirectTaskResponse) => {
      this.processedCount = res.results.filter((task: { status: TaskLogState; }) => (task.status && task.status !== TaskLogState.IN_PROGRESS && task.status !== TaskLogState.ENQUEUED)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / this.exportableAccountingExportIds.length) * 100);

      if (res.results.filter((task: { status: TaskLogState; }) => (this.exportLogProcessingStates.includes(task.status))).length === 0) {
        forkJoin([
          this.getExportErrors$,
          this.getAccountingExportSummary$
        ]).subscribe(responses => {
          this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0].results);
          this.groupedErrorStat = {
            EMPLOYEE_MAPPING: null,
            CATEGORY_MAPPING: null
          };
          this.accountingExportSummary = AccountingExportSummaryModel.parseAPIResponseToAccountingSummaryForQbdDirect(responses[1]);
          this.failedExpenseGroupCount = res.results.filter(task => task.status === TaskLogState.ERROR || task.status === TaskLogState.FATAL).length;

          this.exportableAccountingExportIds = res.results.filter(task => task.status === TaskLogState.ERROR || task.status === TaskLogState.FATAL).map(taskLog => taskLog.id);

          this.isExportInProgress = false;
          this.exportProgressPercentage = 0;
          this.processedCount = 0;

          if (this.failedExpenseGroupCount === 0) {
            this.refinerService.triggerSurvey(
              AppName.QBD_DIRECT, environment.refiner_survey.qbd.export_done_survery_id, RefinerSurveyType.EXPORT_DONE
            );
          }
        });
      }
    });
  }

  private setupPage(): void {
    forkJoin([
      this.getExportErrors$,
      this.getAccountingExportSummary$.pipe(catchError(() => of(null))),
      this.dashboardService.getAllTasks(this.exportLogProcessingStates.concat(TaskLogState.ERROR), undefined, [], AppName.QBD_DIRECT),
      this.dashboardService.getExportableAccountingExportIds('v2'),
      this.QbdDirectExportSettingsService.getQbdExportSettings(),
      this.importSettingService.getImportSettings(),
      this.qbdDirectAdvancedSettingsService.getQbdAdvancedSettings()
    ]).subscribe((responses) => {
      this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0].results);
      this.isImportItemsEnabled = responses[3].import_items;
      if (responses[1]) {
        this.accountingExportSummary = AccountingExportSummaryModel.parseAPIResponseToAccountingSummaryForQbdDirect(responses[1]);
      }
      this.destinationFieldMap = {
        EMPLOYEE: responses[4].employee_field_mapping,
        CATEGORY: 'ACCOUNT'
      };

      this.isLoading = false;

      this.importCodeFields = responses[5].import_settings?.import_code_fields;

      this.chartOfAccounts = responses[5].import_settings.import_account_as_category ? responses[5].import_settings.chart_of_accounts.map((item: string) => item.replace(/\s+/g, '')) : this.importSettingService.getChartOfAccountTypesList().map((item: string) => item.replace(/\s+/g, ''));

      const queuedTasks: QbdDirectTaskLog[] = responses[2].results.filter((task: QbdDirectTaskLog) => this.exportLogProcessingStates.includes(task.status));
      this.failedExpenseGroupCount = responses[2].results.filter((task: QbdDirectTaskLog) => task.status === TaskLogState.ERROR || task.status === TaskLogState.FATAL).length;

      this.exportableAccountingExportIds = responses[3].exportable_export_log_ids?.length ? responses[3].exportable_export_log_ids : [];

      this.reimbursableImportState = responses[4]?.reimbursable_expense_export_type && responses[4].reimbursable_expense_state ? this.reimbursableExpenseImportStateMap[responses[4].reimbursable_expense_state] : null;
      this.cccImportState = responses[4].credit_card_expense_export_type && responses[4].credit_card_expense_state ? this.cccExpenseImportStateMap[responses[4].credit_card_expense_state] : null;

      this.isRealTimeExportEnabled = responses[6]?.is_real_time_export_enabled;

      this.isEmployeeAndVendorAllowed = this.qbdDirectMappingService.getIsEmployeeAndVendorAllowed(responses[4]);

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
        this.pollExportStatus(this.exportableAccountingExportIds);
      } else {
        this.accountingExportService.importExpensesFromFyle('v2').subscribe(() => {
          this.dashboardService.getExportableAccountingExportIds('v2').subscribe((exportableAccountingExportIds) => {
            this.exportableAccountingExportIds = exportableAccountingExportIds.exportable_export_log_ids?.length ? exportableAccountingExportIds.exportable_export_log_ids : [];
            this.isImportInProgress = false;
          });
        });
      }
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
