import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel } from 'src/app/core/models/db/dashboard.model';
import { AppName, CCCImportState, ReimbursableImportState, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';

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

  processedCount: number = 0;

  private destroy$ = new Subject<void>();

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  constructor(
    private accountingExportService: AccountingExportService,
    private dashboardService: DashboardService,
    private sage50ExportSettingService: Sage50ExportSettingsService,
    private router: Router
  ) { }

  export() {
    this.isExportInProgress = true;
    this.dashboardService.triggerAccountingExport().subscribe(() => {
      this.setupPage();
    });
  }

  private setupPage(): void {
    forkJoin([
      this.dashboardService.getAllTasks([TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS, TaskLogState.FAILED], undefined, [], AppName.SAGE50),
      this.dashboardService.getExportableAccountingExportIds('v2'),
      this.sage50ExportSettingService.getExportSettings()
    ]).subscribe((responses) => {
      this.isLoading = false;

      const queuedTasks = responses[0].results.filter((task: any) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[0].results.filter((task: any) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

      this.exportableAccountingExportIds = responses[1].exportable_expense_group_ids;

      this.reimbursableImportState = (responses[2]?.reimbursable_expense_export_type && responses[2]?.reimbursable_expense_state) ? this.reimbursableExpenseImportStateMap[responses[2].reimbursable_expense_state] : null;
      this.cccImportState = (responses[2]?.credit_card_expense_export_type && responses[2]?.credit_card_expense_state) ? this.cccExpenseImportStateMap[responses[2].credit_card_expense_state] : null;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
      } else {
        this.accountingExportService.importExpensesFromFyle('v2').subscribe(() => {
          this.dashboardService.getExportableAccountingExportIds('v2').subscribe((exportableAccountingExportIds) => {
            this.exportableAccountingExportIds = exportableAccountingExportIds.exportable_expense_group_ids;
            this.isImportInProgress = false;
            this.isExportInProgress = false;
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

