import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardModel } from 'src/app/core/models/db/dashboard.model';
import { AppName, ButtonSize, ButtonType, CCCImportState, ReimbursableImportState, TaskLogState, FyleField, Sage50AttributeType, MappingState } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50MappingService } from 'src/app/core/services/sage50/sage50-mapping.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { TranslocoService } from '@jsverse/transloco';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { debounceTime, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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

  isSage50TokenNotValid: boolean = false;

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

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private accountingExportService: AccountingExportService,
    private dashboardService: DashboardService,
    private sage50ExportSettingService: Sage50ExportSettingsService,
    private sage50MappingService: Sage50MappingService,
    private paginatorService: PaginatorService,
    private userService: UserService,
    private windowService: WindowService,
    private translocoService: TranslocoService,
    private router: Router,
    private mappingService: MappingService
  ) { }

  export() {
    this.isExportInProgress = true;
    this.dashboardService.triggerAccountingExport("v2").subscribe(() => {
      this.setupPage();
    });
  }


  openExpenseInFyle(expense_id: string) {
    this.windowService.openInNewTab(AccountingExportService.getFyleExpenseUrl(expense_id));
  }

  navigateToEmployeeMapping() {
    this.showMappingDialog('EMPLOYEE', Sage50AttributeType.VENDOR);
  }

  navigateToCorporateCardMapping() {
    this.showMappingDialog('CORPORATE_CARD', Sage50AttributeType.ACCOUNT);
  }

  showMappingDialog(mappingType: 'EMPLOYEE' | 'CORPORATE_CARD', destinationType: string) {
    this.isMappingDialogLoading = true;
    this.isMappingDialogVisible = true;

    // Set dialog title and description based on mapping type
    if (mappingType === 'EMPLOYEE') {
      this.mappingDialogTitle = 'sage50Dashboard.employeeMappingDialogTitle';
      this.mappingDialogDescription = 'sage50Dashboard.employeeMappingDialogDescription';
      this.mappingSourceField = FyleField.EMPLOYEE;
      this.mappingDestinationField = destinationType;
      this.employeeFieldMapping = FyleField.VENDOR;
    } else {
      this.mappingDialogTitle = 'sage50Dashboard.corporateCardMappingDialogTitle';
      this.mappingDialogDescription = 'sage50Dashboard.corporateCardMappingDialogDescription';
      this.mappingSourceField = FyleField.CORPORATE_CARD;
      this.mappingDestinationField = destinationType;
      this.employeeFieldMapping = FyleField.VENDOR;
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
    this.getPendingMappings();
  }

  private getPendingMappings(): void {
    this.sage50ExportSettingService.getExportSettings().subscribe((exportSettings) => {
      if (exportSettings) {
        this.reimbursableExportType = exportSettings.reimbursable_expense_export_type;
        this.cccExportType = exportSettings.credit_card_expense_export_type;

        const observables: any[] = [];
        let employeeIndex = -1;
        let corporateCardIndex = -1;

        if (this.reimbursableExportType === Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY) {
          employeeIndex = observables.length;
          observables.push(
            this.sage50MappingService.getEmployeeMappingStats('VENDOR').pipe(
              catchError(() => of(null))
            )
          );
        }

        if (this.cccExportType === Sage50CCCExportType.PAYMENTS_JOURNAL) {
          corporateCardIndex = observables.length;
          observables.push(
            this.sage50MappingService.getCorporateCardMappingStats('ACCOUNT').pipe(
              catchError(() => of(null))
            )
          );
        }

        if (observables.length > 0) {
          forkJoin(observables).subscribe((responses) => {
            if (employeeIndex >= 0 && responses[employeeIndex]) {
              this.employeeMappingStats = responses[employeeIndex];
            }
            if (corporateCardIndex >= 0 && responses[corporateCardIndex]) {
              this.corporateCardMappingStats = responses[corporateCardIndex];
            }

            this.showPendingMappings =
              (this.employeeMappingStats?.unmapped_attributes_count ?? 0) > 0 ||
              (this.corporateCardMappingStats?.unmapped_attributes_count ?? 0) > 0;
          });
        }
      }
    });
  }

  private setupPage(): void {
    this.getPendingMappings();

    this.accountingExportService.getExportLogs(['ENQUEUED', 'IN_PROGRESS', 'COMPLETE', 'FAILED']).subscribe((exportLogsResponse) => {
    
    });

    forkJoin([
      this.dashboardService.getExportableAccountingExportIds('v2'),
      this.sage50ExportSettingService.getExportSettings()

    ]).subscribe((responses) => {
      this.isLoading = false;

      const queuedTasks = responses[0].results.filter((task: any) => task.status === TaskLogState.ENQUEUED || task.status === TaskLogState.IN_PROGRESS);
      this.failedExpenseGroupCount = responses[0].results.filter((task: any) => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).length;

      this.exportableAccountingExportIds = responses[0].exportable_expense_group_ids;

      this.reimbursableImportState = (responses[1]?.reimbursable_expense_export_type && responses[1]?.reimbursable_expense_state) ? this.reimbursableExpenseImportStateMap[responses[1].reimbursable_expense_state] : null;
      this.cccImportState = (responses[1]?.credit_card_expense_export_type && responses[1]?.credit_card_expense_state) ? this.cccExpenseImportStateMap[responses[1].credit_card_expense_state] : null;

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
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

