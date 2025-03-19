import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, catchError, forkJoin, from, interval, of, switchMap, takeWhile } from 'rxjs';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { BusinessCentralAccountingExport, BusinessCentralAccountingExportResponse } from 'src/app/core/models/business-central/db/business-central-accounting-export.model';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel, DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { Error, AccountingGroupedErrorStat, AccountingGroupedErrors, ErrorResponse } from 'src/app/core/models/db/error.model';
import { AccountingErrorType, AccountingExportStatus, AccountingExportType, AppName, BusinessCentralExportType, CCCImportState, RefinerSurveyType, ReimbursableImportState } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralExportSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-export-settings.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-business-central-dashboard',
  templateUrl: './business-central-dashboard.component.html',
  styleUrls: ['./business-central-dashboard.component.scss']
})
export class BusinessCentralDashboardComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  appName: AppName = AppName.BUSINESS_CENTRAL;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary | null;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  destinationFieldMap : DestinationFieldMap;

  readonly accountingExportType: BusinessCentralExportType[] = [BusinessCentralExportType.PURCHASE_INVOICE, BusinessCentralExportType.JOURNAL_ENTRY];

  getExportErrors$: Observable<ErrorResponse> = this.dashboardService.getExportErrors();

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.accountingExportService.getAccountingExportSummary();

  isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  private destroy$ = new Subject<void>();

  constructor(
    private refinerService: RefinerService,
    private dashboardService: DashboardService,
    private accountingExportService: AccountingExportService,
    private exportService: BusinessCentralExportSettingsService
  ) { }

  private pollExportStatus(exportableAccountingExportIds: number[] = []): void {
    interval(3000).pipe(
      switchMap(() => from(this.accountingExportService.getAccountingExports(this.accountingExportType, [], exportableAccountingExportIds, 500, 0))),
      takeWhile((response: BusinessCentralAccountingExportResponse) =>
        response.results.filter(task =>
          (task.status === AccountingExportStatus.IN_PROGRESS || task.status === AccountingExportStatus.ENQUEUED || task.status === AccountingExportStatus.EXPORT_QUEUED)
        ).length > 0, true
      )
    ).subscribe((res: BusinessCentralAccountingExportResponse) => {
      this.processedCount = res.results.filter(task => (task.status !== AccountingExportStatus.IN_PROGRESS && task.status !== AccountingExportStatus.ENQUEUED && task.status !== AccountingExportStatus.EXPORT_QUEUED)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / this.exportableAccountingExportIds.length) * 100);

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
              AppName.BUSINESS_CENTRAL, environment.refiner_survey.intacct.export_done_survery_id, RefinerSurveyType.EXPORT_DONE
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
      this.exportService.getExportSettings()
    ]).subscribe((responses) => {
      this.errors = DashboardModel.parseAPIResponseToGroupedError(responses[0].results);
      this.accountingExportSummary = responses[1];

      const queuedTasks: BusinessCentralAccountingExport[] = responses[2].results.filter((accountingExport: BusinessCentralAccountingExport) => accountingExport.status === AccountingExportStatus.ENQUEUED || accountingExport.status === AccountingExportStatus.IN_PROGRESS || accountingExport.status === AccountingExportStatus.EXPORT_QUEUED);
      this.failedExpenseGroupCount = responses[2].results.filter((accountingExport: BusinessCentralAccountingExport) => accountingExport.status === AccountingExportStatus.FAILED || accountingExport.status === AccountingExportStatus.FATAL).length;
      this.exportableAccountingExportIds = responses[3].exportable_accounting_export_ids ?? [];

      this.destinationFieldMap = {
        'EMPLOYEE': responses[4].employee_field_mapping,
        'CATEGORY': 'ACCOUNT'
      };

      this.reimbursableImportState = responses[4].reimbursable_expenses_export_type ? this.reimbursableExpenseImportStateMap[responses[4].reimbursable_expense_state] : null;
      this.cccImportState = responses[4].credit_card_expense_export_type ? this.cccExpenseImportStateMap[responses[4].credit_card_expense_state] : null;

      this.isLoading = false;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
        this.pollExportStatus(this.exportableAccountingExportIds);
      } else {
        this.accountingExportService.importExpensesFromFyle().subscribe(() => {
          this.dashboardService.getExportableAccountingExportIds().subscribe((exportableAccountingExportIds) => {
            this.exportableAccountingExportIds = exportableAccountingExportIds.exportable_accounting_export_ids ?? [];
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
