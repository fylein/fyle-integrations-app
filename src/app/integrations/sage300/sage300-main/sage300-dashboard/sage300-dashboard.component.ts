import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, catchError, forkJoin, from, interval, map, of, switchMap, takeUntil, takeWhile } from 'rxjs';
import { Error, AccountingGroupedErrorStat, AccountingGroupedErrors, ErrorResponse } from 'src/app/core/models/db/error.model';
import { AccountingErrorType, AccountingExportStatus, AccountingExportType, AppName, CCCImportState, FyleField, LoaderType, RefinerSurveyType, ReimbursableImportState } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { environment } from 'src/environments/environment';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel, DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { Sage300AccountingExportResponse, Sage300AccountingExport } from 'src/app/core/models/sage300/db/sage300-accounting-export.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { Sage300ExportSettingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-export-setting.service';
import { Sage300ImportSettingsService } from 'src/app/core/services/sage300/sage300-configuration/sage300-import-settings.service';

@Component({
  selector: 'app-sage300-dashboard',
  templateUrl: './sage300-dashboard.component.html',
  styleUrls: ['./sage300-dashboard.component.scss']
})
export class Sage300DashboardComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  appName: AppName = AppName.SAGE300;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary | null;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  private destroy$ = new Subject<void>();

  readonly destinationFieldMap : DestinationFieldMap = {
    'EMPLOYEE': 'VENDOR',
    'CATEGORY': 'ACCOUNT'
  };

  readonly accountingExportType: AccountingExportType[] = [AccountingExportType.DIRECT_COSTS, AccountingExportType.PURCHASE_INVOICE];

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  getExportErrors$: Observable<ErrorResponse> = this.dashboardService.getExportErrors();

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.accountingExportService.getAccountingExportSummary();

  LoaderType = LoaderType;

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  importCodeFields: any;

  constructor(
    private accountingExportService: AccountingExportService,
    private dashboardService: DashboardService,
    private refinerService: RefinerService,
    private sage300ExportSettingService: Sage300ExportSettingService,
    private sage300ImportSettingService: Sage300ImportSettingsService
  ) { }

  private pollExportStatus(exportableAccountingExportIds: number[] = []): void {
    interval(20000).pipe(
      switchMap(() => from(this.accountingExportService.getAccountingExports(this.accountingExportType, [], exportableAccountingExportIds, 500, 0))),
      takeUntil(this.destroy$),
      takeWhile((response: Sage300AccountingExportResponse) =>
        response.results.filter(task =>
          (task.status === AccountingExportStatus.IN_PROGRESS || task.status === AccountingExportStatus.ENQUEUED || task.status === AccountingExportStatus.EXPORT_QUEUED)
        ).length > 0, true
      )
    ).subscribe((res: Sage300AccountingExportResponse) => {
      this.processedCount = res.results.filter(task => (task.status !== AccountingExportStatus.IN_PROGRESS && task.status !== AccountingExportStatus.ENQUEUED && task.status !== AccountingExportStatus.EXPORT_QUEUED)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / this.exportableAccountingExportIds.length) * 100);
      this.exportableAccountingExportIds = res.results.map(accountingExport => accountingExport.id);
      if (res.results.filter(task => (task.status === AccountingExportStatus.IN_PROGRESS || task.status === AccountingExportStatus.ENQUEUED || task.status === AccountingExportStatus.EXPORT_QUEUED)).length === 0) {
        forkJoin([
          this.getExportErrors$,
          this.getAccountingExportSummary$
        ]).subscribe(responses => {
          this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0].results);
          this.groupedErrorStat = {
            EMPLOYEE_MAPPING: null,
            CATEGORY_MAPPING: null
          };
          this.accountingExportSummary = responses[1];
          this.failedExpenseGroupCount = res.results.filter(task => task.status === AccountingExportStatus.FAILED || task.status === AccountingExportStatus.FATAL).length;

          this.exportableAccountingExportIds = res.results.filter(task => task.status === AccountingExportStatus.FAILED || task.status === AccountingExportStatus.FATAL).map(taskLog => taskLog.id);

          this.isExportInProgress = false;
          this.exportProgressPercentage = 0;
          this.processedCount = 0;

          if (this.failedExpenseGroupCount === 0) {
            this.refinerService.triggerSurvey(
              AppName.SAGE300, environment.refiner_survey.intacct.export_done_survery_id, RefinerSurveyType.EXPORT_DONE
            );
          }
        });
      }
    });
  }

  export() {
    this.isExportInProgress = true;
    this.dashboardService.triggerAccountingExport().subscribe(() => {
      this.pollExportStatus(this.exportableAccountingExportIds);
    });
  }

  private setupPage(): void {
    forkJoin([
      this.getExportErrors$,
      this.getAccountingExportSummary$.pipe(catchError(() => of(null))),
      this.accountingExportService.getAccountingExports(this.accountingExportType, [AccountingExportStatus.ENQUEUED, AccountingExportStatus.IN_PROGRESS, AccountingExportStatus.EXPORT_QUEUED, AccountingExportStatus.FAILED, AccountingExportStatus.FATAL], [], 500, 0),
      this.dashboardService.getExportableAccountingExportIds(),
      this.sage300ExportSettingService.getSage300ExportSettings(),
      this.sage300ImportSettingService.getSage300ImportSettings()
    ]).subscribe((responses) => {
      this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0].results);
      this.accountingExportSummary = responses[1];
      this.exportableAccountingExportIds = responses[3].exportable_accounting_export_ids;

      const queuedTasks: Sage300AccountingExport[] = responses[2].results.filter((accountingExport: Sage300AccountingExport) => accountingExport.status === AccountingExportStatus.ENQUEUED || accountingExport.status === AccountingExportStatus.IN_PROGRESS || accountingExport.status === AccountingExportStatus.EXPORT_QUEUED);
      this.failedExpenseGroupCount = responses[2].results.filter((accountingExport: Sage300AccountingExport) => accountingExport.status === AccountingExportStatus.FAILED || accountingExport.status === AccountingExportStatus.FATAL).length;

      this.reimbursableImportState = responses[4].reimbursable_expenses_export_type ? this.reimbursableExpenseImportStateMap[responses[4].reimbursable_expense_state] : null;
      this.cccImportState = responses[4].credit_card_expense_export_type ? this.cccExpenseImportStateMap[responses[4].credit_card_expense_state] : null;

      this.importCodeFields = responses[5].import_settings.import_code_fields ? responses[5].import_settings.import_code_fields : [];

      this.isLoading = false;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
        this.pollExportStatus(this.exportableAccountingExportIds);
      } else {
        this.accountingExportService.importExpensesFromFyle().subscribe(() => {
          this.dashboardService.getExportableAccountingExportIds().subscribe((exportableAccountingExportIds) => {
            this.exportableAccountingExportIds = exportableAccountingExportIds.exportable_accounting_export_ids;
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
