import { Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, from, interval, map, of, switchMap, takeWhile } from 'rxjs';
import { Error, AccountingGroupedErrorStat, AccountingGroupedErrors } from 'src/app/core/models/db/error.model';
import { AccountingExportResponse, AccountingExport } from 'src/app/core/models/db/accounting-export.model';
import { AccountingErrorType, AccountingExportStatus, AccountingExportType, AppName, RefinerSurveyType } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { RefinerService } from 'src/app/core/services/integration/refiner.service';
import { environment } from 'src/environments/environment';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';

@Component({
  selector: 'app-sage300-dashboard',
  templateUrl: './sage300-dashboard.component.html',
  styleUrls: ['./sage300-dashboard.component.scss']
})
export class Sage300DashboardComponent implements OnInit {

  isLoading: boolean = true;

  appName: AppName = AppName.SAGE300;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  getExportErrors$: Observable<Error[]> = this.dashboardService.getExportErrors();

  getAccountingExportSummary$: Observable<AccountingExportSummary> = this.dashboardService.getAccountingExportSummary();

  constructor(
    private refinerService: RefinerService,
    private dashboardService: DashboardService
  ) { }

  private formatErrors(errors: Error[]): AccountingGroupedErrors {
    return errors.reduce((groupedErrors: AccountingGroupedErrors, error: Error) => {
      const group: Error[] = groupedErrors[error.type] || [];
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
      this.processedCount = res.results.filter(task => (task.status !== AccountingExportStatus.IN_PROGRESS && task.status !== AccountingExportStatus.ENQUEUED) && (task.type !== AccountingExportType.PURCHASE_INVOICE && task.type !== AccountingExportType.DIRECT_COSTS)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / this.exportableAccountingExportIds.length) * 100);

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
        this.failedExpenseGroupCount = res.results.filter(task => task.status === AccountingExportStatus.FAILED || task.status === AccountingExportStatus.FATAL).length;
        this.isExportInProgress = false;
        this.exportProgressPercentage = 0;
        this.processedCount = 0;

        if (this.failedExpenseGroupCount === 0) {
          this.refinerService.triggerSurvey(
            AppName.SAGE300, environment.refiner_survey.intacct.export_done_survery_id, RefinerSurveyType.EXPORT_DONE
          );
        }
      }
    });
  }

  export(eventData: boolean) {
    if (eventData) {
      this.isExportInProgress = true;
      this.dashboardService.triggerAccountingExport().subscribe(() => {
        this.pollExportStatus();
      });
    } else {
      this.isExportInProgress = false;
    }
  }

  private setupPage(): void {
    forkJoin([
      this.getExportErrors$,
      this.getAccountingExportSummary$,
      this.dashboardService.getAccountingExports([AccountingExportStatus.ENQUEUED, AccountingExportStatus.IN_PROGRESS, AccountingExportStatus.FAILED, AccountingExportStatus.FATAL])
    ]).subscribe((responses) => {
      this.errors = this.formatErrors(responses[0]);
      this.accountingExportSummary = responses[1];

      const queuedTasks: AccountingExport[] = responses[2].results.filter((accountingExport: AccountingExport) => accountingExport.status === AccountingExportStatus.ENQUEUED || accountingExport.status === AccountingExportStatus.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[2].results.filter((accountingExport: AccountingExport) => accountingExport.status === AccountingExportStatus.FAILED || accountingExport.status === AccountingExportStatus.FATAL).length;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
        this.pollExportStatus();
      } else {
        this.dashboardService.importExpensesFromFyle().subscribe(() => {
          this.isLoading = false;
          this.isImportInProgress = false;
        });
      }
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
