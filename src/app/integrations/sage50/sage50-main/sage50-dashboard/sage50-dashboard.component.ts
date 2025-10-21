import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel } from 'src/app/core/models/db/dashboard.model';
import { AppName, ButtonSize, ButtonType, CCCImportState, ReimbursableImportState, TaskLogState, FyleField, MappingState } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { FormBuilder } from '@angular/forms';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { Sage50ReimbursableExportType, Sage50CCCExportType } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExtendedGenericMapping } from 'src/app/core/models/db/extended-generic-mapping.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sage50-dashboard',
  standalone: true,
  imports: [SharedModule, CommonModule, DialogModule],
  templateUrl: './sage50-dashboard.component.html',
  styleUrls: ['./sage50-dashboard.component.scss']
})
export class Sage50DashboardComponent implements OnInit, OnDestroy {

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

  private destroy$ = new Subject<void>();

  reimbursableImportState: ReimbursableImportState | null;

  private readonly reimbursableExpenseImportStateMap = DashboardModel.getReimbursableExpenseImportStateMap();

  cccImportState: CCCImportState | null;

  private readonly cccExpenseImportStateMap = DashboardModel.getCCCExpenseImportStateMap();

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  employeeMappingStats: MappingStats | null = null;

  corporateCardMappingStats: MappingStats | null = null;

  showPendingMappings: boolean = false;

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

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private accountingExportService: AccountingExportService,
    private dashboardService: DashboardService,
    private sage50ExportSettingService: Sage50ExportSettingsService,
    private mappingService: MappingService
  ) { }

  export() {
    this.isExportInProgress = true;
    this.dashboardService.triggerAccountingExport("v2").subscribe(() => {
      this.setupPage();
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

    // Fetch destination options and unmapped source attributes
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
      this.setPendingMappings(responses[0], responses[1]);
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

  private setupPage(): void {

    forkJoin([
      this.dashboardService.getExportableAccountingExportIds('v2'),
      this.sage50ExportSettingService.getExportSettings(),
      this.accountingExportService.getExportLogs(
        ['ENQUEUED', 'IN_PROGRESS', 'COMPLETE', 'FAILED'],
        ['PAYMENTS_JOURNAL', 'PURCHASES_RECEIVE_INVENTORY', 'GENERAL_JOURNAL_ENTRY']
      ),
      this.mappingService.getMappingStats('EMPLOYEE', 'VENDOR', AppName.SAGE50),
      this.mappingService.getMappingStats('CORPORATE_CARD', 'ACCOUNT', AppName.SAGE50)
    ]).subscribe((responses) => {
      this.isLoading = false;

      const exportableResponse = responses[0];
      const exportSettings = responses[1];
      const exportLogs = responses[2];
      const employeeMappingStats = responses[3];
      const corporateCardMappingStats = responses[4];

      if (exportSettings) {
      this.reimbursableExportType = exportSettings.reimbursable_expense_export_type;
      this.cccExportType = exportSettings.credit_card_expense_export_type;
      this.setPendingMappings(employeeMappingStats, corporateCardMappingStats);
      }
      const queuedTasks = exportLogs.results.filter((task: any) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = exportLogs.results.filter((task: any) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

      const exportableCount = exportableResponse?.ready_to_export_count || 0;
      this.exportableAccountingExportIds = Array(exportableCount).fill(0).map((_, i) => i + 1);

      this.reimbursableImportState = (exportSettings?.reimbursable_expense_export_type && exportSettings?.reimbursable_expense_state) ? this.reimbursableExpenseImportStateMap[exportSettings.reimbursable_expense_state] : null;
      this.cccImportState = (exportSettings?.credit_card_expense_export_type && exportSettings?.credit_card_expense_state) ? this.cccExpenseImportStateMap[exportSettings.credit_card_expense_state] : null;

      if (queuedTasks.length) {
        this.isImportInProgress = false;
        this.isExportInProgress = true;
      } else {
        this.accountingExportService.importExpensesFromFyle('v3').subscribe(() => {
          this.dashboardService.getExportableAccountingExportIds('v2').subscribe((exportableAccountingExportIds) => {
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

