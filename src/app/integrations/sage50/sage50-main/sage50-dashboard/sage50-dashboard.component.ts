import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, catchError, forkJoin, from, interval, of, switchMap, takeUntil, takeWhile } from 'rxjs';
import { Error, AccountingGroupedErrorStat, AccountingGroupedErrors, ErrorResponse } from 'src/app/core/models/db/error.model';
import { AccountingErrorType, AccountingExportStatus, AccountingExportType, AppName, CCCImportState, LoaderType, RefinerSurveyType, ReimbursableImportState } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { environment } from 'src/environments/environment';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel, DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50ImportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-settings.service';

@Component({
  selector: 'app-sage50-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sage50-dashboard.component.html',
  styleUrls: ['./sage50-dashboard.component.scss']
})
export class Sage50DashboardComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  appName: AppName = AppName.SAGE50;

  isImportInProgress: boolean = true;

  isSage50TokenNotValid: boolean = false;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary | null;

  isRealTimeExportEnabled: boolean = false;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  private destroy$ = new Subject<void>();

  readonly destinationFieldMap: DestinationFieldMap = {
    'EMPLOYEE': 'VENDOR',
    'CATEGORY': 'ACCOUNT'
  };

  readonly accountingExportType: AccountingExportType[] = [AccountingExportType.DIRECT_COSTS, AccountingExportType.PURCHASE_INVOICE];

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  getExportErrors$: Observable<ErrorResponse> = this.dashboardService.getExportErrors();

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.accountingExportService.getAccountingExportSummary(undefined, true, AppName.SAGE50);

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
    private sage50ExportSettingService: Sage50ExportSettingsService,
    private sage50ImportSettingService: Sage50ImportSettingsService,
    private router: Router
  ) { }

  private pollExportStatus(exportableAccountingExportIds: number[] = []): void {
    interval(20000).pipe(
      switchMap(() => from(this.accountingExportService.getAccountingExports(this.accountingExportType, [], exportableAccountingExportIds, 500, 0))),
      takeUntil(this.destroy$),
      takeWhile((response: any) =>
        response.results.filter((task: any) =>
          (task.status === AccountingExportStatus.IN_PROGRESS || task.status === AccountingExportStatus.ENQUEUED || task.status === AccountingExportStatus.EXPORT_QUEUED)
        ).length > 0, true
      )
    ).subscribe((res: any) => {
      this.processedCount = res.results.filter((task: any) => (task.status !== AccountingExportStatus.IN_PROGRESS && task.status !== AccountingExportStatus.ENQUEUED && task.status !== AccountingExportStatus.EXPORT_QUEUED)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / this.exportableAccountingExportIds.length) * 100);
      this.exportableAccountingExportIds = res.results.map((accountingExport: any) => accountingExport.id);
      if (res.results.filter((task: any) => (task.status === AccountingExportStatus.IN_PROGRESS || task.status === AccountingExportStatus.ENQUEUED || task.status === AccountingExportStatus.EXPORT_QUEUED)).length === 0) {
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
          this.failedExpenseGroupCount = res.results.filter((task: any) => task.status === AccountingExportStatus.FAILED || task.status === AccountingExportStatus.FATAL).length;

          this.exportableAccountingExportIds = res.results.filter((task: any) => task.status === AccountingExportStatus.FAILED || task.status === AccountingExportStatus.FATAL).map((taskLog: any) => taskLog.id);

          this.isExportInProgress = false;
          this.exportProgressPercentage = 0;
          this.processedCount = 0;

          if (this.failedExpenseGroupCount === 0) {
            this.refinerService.triggerSurvey(
              AppName.SAGE50, environment.refiner_survey.intacct.export_done_survery_id, RefinerSurveyType.EXPORT_DONE
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


  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

