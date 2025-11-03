import { Component, OnDestroy, OnInit, Inject, ViewChild } from '@angular/core';
import { Subject, forkJoin, interval, from, Observable } from 'rxjs';
import { map, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel } from 'src/app/core/models/db/dashboard.model';
import { AppName, ButtonSize, ButtonType, CCCImportState, ReimbursableImportState, TaskLogState, FyleField, MappingState, LoaderType, TrackingApp, ClickEvent } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { ErrorStat } from 'src/app/core/models/db/error.model';
import { brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50ImportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-settings.service';
import { FormBuilder } from '@angular/forms';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { Sage50ReimbursableExportType, Sage50CCCExportType } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { Sage50ImportableField } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExtendedGenericMapping } from 'src/app/core/models/db/extended-generic-mapping.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { CsvExportLogComponent } from "src/app/shared/components/export-log/csv-export-log/csv-export-log.component";
import { SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { MenuItem } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { SkipExportList, SkipExportLogResponse } from 'src/app/core/models/intacct/db/expense-group.model';
import { SkippedAccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { UserService } from 'src/app/core/services/misc/user.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-sage50-dashboard',
  standalone: true,
  imports: [SharedModule, CommonModule, DialogModule, CsvExportLogComponent],
  templateUrl: './sage50-dashboard.component.html',
  styleUrls: ['./sage50-dashboard.component.scss']
})
export class Sage50DashboardComponent implements OnInit, OnDestroy {

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly exportLogArticleLink = brandingKbArticles.postOnboardingArticles.SAGE50.EXPORT_LOG;

  isLoading: boolean = true;

  appName: AppName = AppName.SAGE50;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary | null;

  processedCount: number = 0;

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  LoaderType = LoaderType;

  private destroy$ = new Subject<void>();

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  employeeMappingStats: MappingStats | null = null;

  corporateCardMappingStats: MappingStats | null = null;

  showPendingMappings: boolean = false;

  employeeMappingErrorStat: ErrorStat | null = null;

  corporateCardMappingErrorStat: ErrorStat | null = null;

  reimbursableExportType: Sage50ReimbursableExportType | null = null;

  cccExportType: Sage50CCCExportType | null = null;

  isMappingDialogVisible: boolean = false;

  isMappingDialogLoading: boolean = false;

  mappingDialogTitle: string = '';

  mappingDialogDescription: string = '';

  mappingSourceField: string = '';

  mappingDestinationField: string = '';

  employeeFieldMapping: FyleField = FyleField.VENDOR;

  mappingDestinationOptions: DestinationAttribute[] = [];

  filteredMappings: ExtendedGenericMapping[] = [];

  currentMappingStats: MappingStats | null = null;

  @ViewChild(CsvExportLogComponent) csvExportLogComponent!: CsvExportLogComponent;

  shouldShowExportLog: boolean = false;

  exportLogModules: MenuItem[] = [];

  activeExportLogModule: MenuItem;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private accountingExportService: AccountingExportService,
    private dashboardService: DashboardService,
    private sage50ExportSettingService: Sage50ExportSettingsService,
    private sage50ImportSettingService: Sage50ImportSettingsService,
    private mappingService: MappingService,
    private skipExportService: SkipExportService,
    private exportLogService: ExportLogService,
    private translocoService: TranslocoService,
    private trackingService: TrackingService
  ) { }

  export() {
    this.isExportInProgress = true;
    this.dashboardService.triggerAccountingExport("v2").subscribe(() => {
      this.trackingService.onClickEvent(TrackingApp.SAGE50, ClickEvent.EXPORT_EXPENSES);
      this.pollExportStatus();
    });
  }

  private pollExportStatus(): void {
    interval(1000).pipe(
      switchMap(() => from(
        this.accountingExportService.getExportLogs(
          [TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS]
        ).toPromise()
      )),
      takeUntil(this.destroy$),
      takeWhile((response: any) =>
        response.results.filter((task: any) =>
          (task.status === TaskLogState.IN_PROGRESS || task.status === TaskLogState.ENQUEUED)
        ).length > 0, true
      )
    ).subscribe((res: any) => {
      const allTasks = res.results;

      if (!allTasks.length) {
          this.exportableAccountingExportIds = [];
          this.isExportInProgress = false;
          this.csvExportLogComponent.applyFilters();
      }
    });
  }

  showMappingDialog(mappingType: 'EMPLOYEE' | 'CORPORATE_CARD', destinationType: string) {
    this.isMappingDialogLoading = true;
    this.isMappingDialogVisible = true;

    // Set dialog title, description and stats based on mapping type
    if (mappingType === 'EMPLOYEE') {
      this.mappingDialogTitle = 'sage50Dashboard.employeeMappingDialogTitle';
      this.mappingDialogDescription = 'sage50Dashboard.employeeMappingDialogDescription';
      this.mappingSourceField = FyleField.EMPLOYEE;
      this.mappingDestinationField = destinationType;
      this.employeeFieldMapping = FyleField.VENDOR;
      this.currentMappingStats = this.employeeMappingStats;
    } else {
      this.mappingDialogTitle = 'sage50Dashboard.corporateCardMappingDialogTitle';
      this.mappingDialogDescription = 'sage50Dashboard.corporateCardMappingDialogDescription';
      this.mappingSourceField = FyleField.CORPORATE_CARD;
      this.mappingDestinationField = destinationType;
      this.employeeFieldMapping = FyleField.VENDOR;
      this.currentMappingStats = this.corporateCardMappingStats;
    }
    this.trackingService.onClickEvent(TrackingApp.SAGE50, ClickEvent.RESOLVE_MAPPING_ERROR, {field: mappingType, stats: this.currentMappingStats});

    // Fetch destination options, unmapped source attributes, and import settings to check if codes should be shown
    forkJoin([
      this.mappingService.getPaginatedDestinationAttributes(destinationType, undefined, undefined),
      this.mappingService.getGenericMappingsV2(100, 0, destinationType, MappingState.UNMAPPED, '', this.mappingSourceField, false, null, this.appName)
    ]).subscribe(
      ([destinationResponse, mappingsResponse]) => {
        this.mappingDestinationOptions = destinationResponse.results;
        this.filteredMappings = mappingsResponse.results;

        this.isMappingDialogLoading = false;
      },
      () => {
        this.isMappingDialogLoading = false;
      }
    );
  }

  handleMappingDialogClose() {
    this.isMappingDialogVisible = false;
    this.filteredMappings = [];

    forkJoin([
      this.mappingService.getMappingStats('EMPLOYEE', 'VENDOR', AppName.SAGE50),
      this.mappingService.getMappingStats('CORPORATE_CARD', 'ACCOUNT', AppName.SAGE50)
    ]).subscribe((responses) => {
      const newEmployeeMappingStats = responses[0];
      const newCorporateCardMappingStats = responses[1];

      if (this.employeeMappingStats) {
        const previousUnmappedCount = this.employeeMappingStats.unmapped_attributes_count;
        const currentUnmappedCount = newEmployeeMappingStats.unmapped_attributes_count;

        // Initialize error stat on first time dialog closes
        if (!this.employeeMappingErrorStat) {
          this.employeeMappingErrorStat = {
            resolvedCount: previousUnmappedCount - currentUnmappedCount,
            totalCount: previousUnmappedCount
          };
        } else if (previousUnmappedCount !== currentUnmappedCount) {
          // Update resolved count
          this.employeeMappingErrorStat = {
            resolvedCount: this.employeeMappingErrorStat.totalCount - currentUnmappedCount,
            totalCount: this.employeeMappingErrorStat.totalCount
          };
        }
      }

      if (this.corporateCardMappingStats) {
        const previousUnmappedCount = this.corporateCardMappingStats.unmapped_attributes_count;
        const currentUnmappedCount = newCorporateCardMappingStats.unmapped_attributes_count;

        // Initialize error stat on first time dialog closes
        if (!this.corporateCardMappingErrorStat) {
          this.corporateCardMappingErrorStat = {
            resolvedCount: previousUnmappedCount - currentUnmappedCount,
            totalCount: previousUnmappedCount
          };
        } else if (previousUnmappedCount !== currentUnmappedCount) {
          // Update resolved count
          this.corporateCardMappingErrorStat = {
            resolvedCount: this.corporateCardMappingErrorStat.totalCount - currentUnmappedCount,
            totalCount: this.corporateCardMappingErrorStat.totalCount
          };
        }
      }

      this.setPendingMappings(newEmployeeMappingStats, newCorporateCardMappingStats);
    });
  }

  setPendingMappings(employeeMappingStats: MappingStats, corporateCardMappingStats: MappingStats): void {

        if (this.reimbursableExportType === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY && employeeMappingStats) {
          this.employeeMappingStats = employeeMappingStats;
        }

        if (this.cccExportType === Sage50CCCExportType.PAYMENTS_JOURNAL && corporateCardMappingStats) {
          this.corporateCardMappingStats = corporateCardMappingStats;
        }

        this.showPendingMappings =
          (this.employeeMappingStats?.unmapped_attributes_count ?? 0) > 0 ||
          (this.corporateCardMappingStats?.unmapped_attributes_count ?? 0) > 0;
  }

  updateExportLogs(limit: number, offset:number, selectedDateFilter: SelectedDateFilter | null, searchQuery: string | null) {
    return this.accountingExportService.getAccountingExports(
      [], [TaskLogState.COMPLETE], null, limit, offset, selectedDateFilter, null, searchQuery, this.appName
    );
  }

  updateSkippedExpenses(limit: number, offset:number, selectedDateFilter: SelectedDateFilter | null, searchQuery: string | null) {
    return this.exportLogService.getSkippedExpenses(limit, offset, selectedDateFilter, searchQuery);
  }

  private setupPage(): void {
    this.exportLogModules = [
      {label: this.translocoService.translate('sage50Dashboard.completed')},
      {label: this.translocoService.translate('sage50Dashboard.skipped')}
    ];
    this.activeExportLogModule = this.exportLogModules[0];

    forkJoin([
      this.dashboardService.getExportableAccountingExportIds('v3'),
      this.sage50ExportSettingService.getExportSettings(),
      this.accountingExportService.getExportLogs(
        [TaskLogState.ENQUEUED, TaskLogState.IN_PROGRESS]
        ),
      this.mappingService.getMappingStats('EMPLOYEE', 'VENDOR', AppName.SAGE50),
      this.mappingService.getMappingStats('CORPORATE_CARD', 'ACCOUNT', AppName.SAGE50),
      this.skipExportService.getExpenseFilter()
    ]).subscribe((responses) => {
      this.isLoading = false;

      const exportableResponse = responses[0];
      const exportSettings = responses[1];
      const exportLogs = responses[2];
      const employeeMappingStats = responses[3];
      const corporateCardMappingStats = responses[4];
      const expenseFilters = responses[5];

      this.shouldShowExportLog =
        this.brandingFeatureConfig.featureFlags.advancedSettings.skipExport &&
        expenseFilters.count > 0;

      this.reimbursableExportType = exportSettings?.reimbursable_expense_export_type ?? null;
      this.cccExportType = exportSettings?.credit_card_expense_export_type ?? null;
      this.setPendingMappings(employeeMappingStats, corporateCardMappingStats);
      const queuedTasks = exportLogs.results.filter((task: any) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);

      const exportableCount = exportableResponse?.ready_to_export_count || 0;
      this.exportableAccountingExportIds = Array(exportableCount).fill(0).map((_, i) => i + 1);

      this.reimbursableImportState = (exportSettings?.reimbursable_expense_export_type && exportSettings?.reimbursable_expense_state) ? this.reimbursableExpenseImportStateMap[exportSettings.reimbursable_expense_state] : null;
      this.cccImportState = (exportSettings?.credit_card_expense_export_type && exportSettings?.credit_card_expense_state) ? this.cccExpenseImportStateMap[exportSettings.credit_card_expense_state] : null;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
        this.pollExportStatus();
      } else {
        this.accountingExportService.importExpensesFromFyle('v3').subscribe(() => {
          this.dashboardService.getExportableAccountingExportIds('v3').subscribe((exportableAccountingExportIds) => {
            const newExportableCount = exportableAccountingExportIds?.ready_to_export_count || 0;
            this.exportableAccountingExportIds = Array(newExportableCount).fill(0).map((_, i) => i + 1);
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

