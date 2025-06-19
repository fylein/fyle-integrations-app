import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { IntacctDashboardComponent } from './intacct-dashboard.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { ExportLogService } from 'src/app/core/services/si/export-log/export-log.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { of } from 'rxjs';
import { AccountingExportSummary, AccountingExportSummaryModel } from 'src/app/core/models/db/accounting-export-summary.model';
import { mockAccountingExportSummary, mockCompletedTasksWithFailures, mockConfiguration, mockErrors, mockExportableAccountingExportIds, mockExportSettingGet, advancedSettings, mockTasksInProgress } from '../../intacct.fixture';
import { SharedModule } from 'src/app/shared/shared.module';
import { Error } from 'src/app/core/models/db/error.model';
import { AccountingErrorType, AppName, CCCImportState, IntacctCategoryDestination, ReimbursableImportState, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SiAdvancedSettingService } from 'src/app/core/services/si/si-configuration/si-advanced-setting.service';
import { TranslocoService } from '@jsverse/transloco';

describe('IntacctDashboardComponent', () => {

  let component: IntacctDashboardComponent;
  let fixture: ComponentFixture<IntacctDashboardComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;
  let accountingExportServiceSpy: jasmine.SpyObj<AccountingExportService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;
  let intacctExportSettingServiceSpy: jasmine.SpyObj<SiExportSettingService>;
  let intacctAdvancedSettingsServiceSpy: jasmine.SpyObj<SiAdvancedSettingService>;
  let exportLogServiceSpy: jasmine.SpyObj<ExportLogService>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const dashboardServiceSpyObj = jasmine.createSpyObj('DashboardService', ['getExportErrors', 'triggerAccountingExport', 'getAllTasks', 'getExportableAccountingExportIds']);
    const accountingExportServiceSpyObj = jasmine.createSpyObj('AccountingExportService', ['getAccountingExportSummary', 'importExpensesFromFyle']);
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const workspaceServiceSpyObj = jasmine.createSpyObj('WorkspaceService', ['getConfiguration', 'getWorkspaceId', 'setOnboardingState']);
    const intacctExportSettingServiceSpyObj = jasmine.createSpyObj('SiExportSettingService', ['getExportSettings']);
    const exportLogServiceSpyObj = jasmine.createSpyObj('ExportLogService', ['getExportLogs']);
    const intacctAdvancedSettingsServiceSpyObj = jasmine.createSpyObj('SiAdvancedSettingService', ['getAdvancedSettings']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true
      },
      langChanges$: of('en'),
      _loadDependencies: () => Promise.resolve()
    });

    await TestBed.configureTestingModule({
    declarations: [IntacctDashboardComponent],
    imports: [SharedModule],
    providers: [
        { provide: DashboardService, useValue: dashboardServiceSpyObj },
        { provide: AccountingExportService, useValue: accountingExportServiceSpyObj },
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: WorkspaceService, useValue: workspaceServiceSpyObj },
        { provide: SiExportSettingService, useValue: intacctExportSettingServiceSpyObj },
        { provide: SiAdvancedSettingService, useValue: intacctAdvancedSettingsServiceSpyObj },
        { provide: ExportLogService, useValue: exportLogServiceSpyObj },
        { provide: TranslocoService, useValue: translocoServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();

    dashboardServiceSpy = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
    accountingExportServiceSpy = TestBed.inject(AccountingExportService) as jasmine.SpyObj<AccountingExportService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
    intacctExportSettingServiceSpy = TestBed.inject(SiExportSettingService) as jasmine.SpyObj<SiExportSettingService>;
    intacctAdvancedSettingsServiceSpy = TestBed.inject(SiAdvancedSettingService) as jasmine.SpyObj<SiAdvancedSettingService>;
    exportLogServiceSpy = TestBed.inject(ExportLogService) as jasmine.SpyObj<ExportLogService>;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;

    userServiceSpy.getUserProfile.and.returnValue({ full_name: 'John Doe' } as MinimalUser);
    dashboardServiceSpy.getExportErrors.and.returnValue(of([]));
    accountingExportServiceSpy.getAccountingExportSummary.and.returnValue(of(mockAccountingExportSummary as unknown as  AccountingExportSummary));
    dashboardServiceSpy.getExportableAccountingExportIds.and.returnValue(of(mockExportableAccountingExportIds));
    dashboardServiceSpy.getAllTasks.and.returnValue(of(mockCompletedTasksWithFailures));
    workspaceServiceSpy.getConfiguration.and.returnValue(of(mockConfiguration));
    intacctExportSettingServiceSpy.getExportSettings.and.returnValue(of(mockExportSettingGet));
    intacctAdvancedSettingsServiceSpy.getAdvancedSettings.and.returnValue(of(advancedSettings));
    dashboardServiceSpy.triggerAccountingExport.and.returnValue(of({}));
    accountingExportServiceSpy.importExpensesFromFyle.and.returnValue(of({}));


    fixture = TestBed.createComponent(IntacctDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize correctly', fakeAsync(() => {
    component.getExportErrors$ = of(mockErrors as Error[]);
    spyOn(AccountingExportSummaryModel, 'parseAPIResponseToAccountingSummary');

    tick();
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.errors).toEqual({
      [AccountingErrorType.EMPLOYEE_MAPPING]: [mockErrors[0]],
      [AccountingErrorType.CATEGORY_MAPPING]: [mockErrors[1]],
      [AccountingErrorType.ACCOUNTING_ERROR]: [mockErrors[2]]
    });

    expect(component.reimbursableImportState).toEqual(ReimbursableImportState.PROCESSING);
    expect(component.cccImportState).toEqual(CCCImportState.PAID);

    expect(AccountingExportSummaryModel.parseAPIResponseToAccountingSummary).toHaveBeenCalledOnceWith(mockAccountingExportSummary);
    expect(component.destinationFieldMap).toEqual({
        "EMPLOYEE": "EMPLOYEE",
        "CATEGORY": IntacctCategoryDestination.EXPENSE_TYPE
    });
    expect(component.exportableAccountingExportIds).toEqual([1, 2, 3]);
    expect(component.failedExpenseGroupCount).toBe(1);
    expect(component.isImportInProgress).toBeFalse();
  }));

  it('should initialize correctly when an export is in progress', fakeAsync(() => {
    dashboardServiceSpy.getAllTasks.and.returnValue(of(mockTasksInProgress));
    spyOn<any>(component, 'pollExportStatus');

    tick();
    fixture.detectChanges();

    expect(component.isImportInProgress).toBeFalse();
    expect(component.isExportInProgress).toBeTrue();

    // eslint-disable-next-line dot-notation
    expect(component['pollExportStatus']).toHaveBeenCalledOnceWith([1, 2, 3]);
  }));

  it('should handle export correctly', fakeAsync(() => {
    dashboardServiceSpy.getAllTasks.and.returnValue(of(mockTasksInProgress));
    component.exportableAccountingExportIds = [1, 2];

    component.export();
    tick(3000);

    expect(component.isExportInProgress).toBeTrue();
    expect(component.processedCount).toBe(1);
    expect(component.exportProgressPercentage).toBe(50);

    // Simulate export completion
    dashboardServiceSpy.getAllTasks.and.returnValue(of(mockCompletedTasksWithFailures));
    dashboardServiceSpy.getExportErrors.and.returnValue(of([]));

    tick(3000);

    expect(component.isExportInProgress).toBeFalse();
    expect(component.failedExpenseGroupCount).toBe(1);

    // The failed expense group should be marked as exportable again
    expect(component.exportableAccountingExportIds).toEqual([2]);
    expect(component.exportProgressPercentage).toBe(0);
    expect(component.processedCount).toBe(0);

    fixture.detectChanges();
    flush();

    discardPeriodicTasks();
  }));
});