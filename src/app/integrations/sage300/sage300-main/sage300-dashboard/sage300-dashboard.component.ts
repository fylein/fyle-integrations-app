import { Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, from, interval, map, of, switchMap, takeWhile } from 'rxjs';
import { AccountingError, AccountingGroupedErrorStat, AccountingGroupedErrors } from 'src/app/core/models/db/accounting-errors.model';
import { AccountingExportResponse, AccountingExportResult, AccountingExportSummary } from 'src/app/core/models/db/accounting-exports.model';
import { AccountingErrorType, AccountingExportStatus, AccountingExportType, AppName, RefinerSurveyType } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sage300-dashboard',
  templateUrl: './sage300-dashboard.component.html',
  styleUrls: ['./sage300-dashboard.component.scss']
})
export class Sage300DashboardComponent implements OnInit {

  isLoading: boolean = true;

  appName: AppName = AppName.SAGE300;

  isImportInProgress: boolean = true;

  exportInProgress: boolean = false;

  readyToExportExpenseCount: number = 0;

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary;

  processedCount: number = 1;

  errors: AccountingGroupedErrors;

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  getExportErrors$: Observable<AccountingError[]> = this.dashboardService.getExportErrors();

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.dashboardService.getAccountingExportSummary();

  constructor(
    private refinerService: RefinerService,
    private dashboardService: DashboardService
  ) { }

  private formatErrors(errors: AccountingError[]): AccountingGroupedErrors {
    return errors.reduce((groupedErrors: AccountingGroupedErrors, error: AccountingError) => {
      const group: AccountingError[] = groupedErrors[error.type] || [];
      group.push(error);
      groupedErrors[error.type] = group;

      return groupedErrors;
    }, {
      [AccountingErrorType.EMPLOYEE_MAPPING]: [],
      [AccountingErrorType.CATEGORY_MAPPING]: []
    });
  }

  private pollExportStatus(): void {
    interval(3000).pipe(
      switchMap(() => from(this.dashboardService.getAccountingExports([]))),
      takeWhile((response: AccountingExportResponse) =>
        response.results.filter(task =>
          (task.status === AccountingExportStatus.IN_PROGRESS || task.status === AccountingExportStatus.ENQUEUED)
        ).length > 0, true
      )
    ).subscribe((res: AccountingExportResponse) => {
      // Processed count value PR review
      this.processedCount = res.results.filter(task => (task.status !== AccountingExportStatus.IN_PROGRESS && task.status !== AccountingExportStatus.ENQUEUED) && (task.type !== AccountingExportType.PURCHASE_INVOICE && task.type !== AccountingExportType.DIRECT_COSTS)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / this.readyToExportExpenseCount) * 100);

      if (res.results.filter(task => (task.status === AccountingExportStatus.IN_PROGRESS || task.status === AccountingExportStatus.ENQUEUED)).length === 0) {
        this.isLoading = true;
        forkJoin([
          this.getExportErrors$,
          this.getAccountingExportSummary$
        ]).subscribe(responses => {
          this.errors = this.formatErrors(responses[0]);
          this.groupedErrorStat = {
            EMPLOYEE_MAPPING: null,
            CATEGORY_MAPPING: null
          };
          this.accountingExportSummary = responses[1];
          this.isLoading = false;
        });
        this.dashboardService.getAccountingExports([AccountingExportStatus.FAILED, AccountingExportStatus.FATAL]).subscribe((accountingResponse) => {
          this.failedExpenseGroupCount = accountingResponse.count;
          this.exportInProgress = false;
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

  export(eventData: boolean) {
    if (eventData) {
      this.exportInProgress = true;
      this.dashboardService.exportAccountingExports().subscribe(() => {
        this.pollExportStatus();
      });
    } else {
      this.exportInProgress = false;
    }
  }

  private setupPage(): void {
    forkJoin([
      this.getExportErrors$,
      this.dashboardService.getAccountingExportSummary(),
      this.dashboardService.getExportableAccountingExportCount(),
      this.dashboardService.getAccountingExports([AccountingExportStatus.ENQUEUED, AccountingExportStatus.IN_PROGRESS, AccountingExportStatus.FAILED])
    ]).subscribe((responses) => {
      this.errors = this.formatErrors(responses[0]);
      this.accountingExportSummary = responses[1];
      this.readyToExportExpenseCount = responses[2].count;

      const queuedTasks: AccountingExportResult[] = responses[3].results.filter((accountingExport: AccountingExportResult) => accountingExport.status === AccountingExportStatus.ENQUEUED || accountingExport.status === AccountingExportStatus.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[3].results.filter((accountingExport: AccountingExportResult) => accountingExport.status === AccountingExportStatus.FAILED).length;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.exportInProgress = true;
        this.pollExportStatus();
      } else {
        this.dashboardService.importAccountingExport().subscribe(() => {});
      }

      this.isLoading = false;
      this.isImportInProgress = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
