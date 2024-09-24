import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { IntacctDashboardComponent } from './intacct-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { ExportLogService } from 'src/app/core/services/si/export-log/export-log.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { of } from 'rxjs';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { mockCompletedTasks, mockExportSettingGet, mockTasksInProgress } from '../../intacct.fixture';
import { SharedModule } from 'src/app/shared/shared.module';

describe('IntacctDashboardComponent', () => {

  let component: IntacctDashboardComponent;
  let fixture: ComponentFixture<IntacctDashboardComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;
  let accountingExportServiceSpy: jasmine.SpyObj<AccountingExportService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;
  let intacctExportSettingServiceSpy: jasmine.SpyObj<SiExportSettingService>;
  let exportLogServiceSpy: jasmine.SpyObj<ExportLogService>;

  beforeEach(async () => {
    const dashboardServiceSpyObj = jasmine.createSpyObj('DashboardService', ['getExportErrors', 'triggerAccountingExport', 'getAllTasks', 'getExportableAccountingExportIds']);
    const accountingExportServiceSpyObj = jasmine.createSpyObj('AccountingExportService', ['getAccountingExportSummary', 'importExpensesFromFyle']);
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const workspaceServiceSpyObj = jasmine.createSpyObj('WorkspaceService', ['getConfiguration', 'getWorkspaceId', 'setOnboardingState']);
    const intacctExportSettingServiceSpyObj = jasmine.createSpyObj('SiExportSettingService', ['getExportSettings']);
    const exportLogServiceSpyObj = jasmine.createSpyObj('ExportLogService', ['getExportLogs']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [IntacctDashboardComponent],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceSpyObj },
        { provide: AccountingExportService, useValue: accountingExportServiceSpyObj },
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: WorkspaceService, useValue: workspaceServiceSpyObj },
        { provide: SiExportSettingService, useValue: intacctExportSettingServiceSpyObj },
        { provide: ExportLogService, useValue: exportLogServiceSpyObj }
      ]
    }).compileComponents();

    dashboardServiceSpy = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
    accountingExportServiceSpy = TestBed.inject(AccountingExportService) as jasmine.SpyObj<AccountingExportService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
    intacctExportSettingServiceSpy = TestBed.inject(SiExportSettingService) as jasmine.SpyObj<SiExportSettingService>;
    exportLogServiceSpy = TestBed.inject(ExportLogService) as jasmine.SpyObj<ExportLogService>;

    userServiceSpy.getUserProfile.and.returnValue({ full_name: 'John Doe' } as MinimalUser);
    dashboardServiceSpy.getExportErrors.and.returnValue(of([]));
    accountingExportServiceSpy.getAccountingExportSummary.and.returnValue(of({} as AccountingExportSummary));
    dashboardServiceSpy.getExportableAccountingExportIds.and.returnValue(of({ exportable_expense_group_ids: [1, 2] }));
    dashboardServiceSpy.getAllTasks.and.returnValue(of(mockTasksInProgress));
    workspaceServiceSpy.getConfiguration.and.returnValue(of({}));
    intacctExportSettingServiceSpy.getExportSettings.and.returnValue(of(mockExportSettingGet));

    fixture = TestBed.createComponent(IntacctDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle export correctly', fakeAsync(() => {
    dashboardServiceSpy.triggerAccountingExport.and.returnValue(of({}));
    dashboardServiceSpy.getAllTasks.and.returnValue(of(mockTasksInProgress));
    component.exportableAccountingExportIds = [1, 2];

    component.export();
    tick(3000);

    expect(component.isExportInProgress).toBeTrue();
    expect(component.processedCount).toBe(1);
    expect(component.exportProgressPercentage).toBe(50);

    // Simulate export completion
    dashboardServiceSpy.getAllTasks.and.returnValue(of(mockCompletedTasks));
    dashboardServiceSpy.getExportErrors.and.returnValue(of([]));
    accountingExportServiceSpy.getAccountingExportSummary.and.returnValue(of({
      total_accounting_export_count: 2,
      successful_accounting_export_count: 2,
      failed_accounting_export_count: 0
    } as AccountingExportSummary));

    tick(3000);

    expect(component.isExportInProgress).toBeFalse();
    expect(component.exportProgressPercentage).toBe(0);
    expect(component.processedCount).toBe(0);
    expect(component.failedExpenseGroupCount).toBe(0);

    fixture.detectChanges();
    flush();

    discardPeriodicTasks();
  }));
});