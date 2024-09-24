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
import { AppName, TaskLogState, TaskLogType } from 'src/app/core/models/enum/enum.model';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { mockAccountingExportSummary, mockCompletedTasks, mockTasksInProgress } from '../../intacct.fixture';

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
    const dashboardServiceSpyObj = jasmine.createSpyObj('DashboardService', ['triggerAccountingExport', 'getAllTasks', 'getExportErrors', 'getExportableAccountingExportIds']);
    const accountingExportServiceSpyObj = jasmine.createSpyObj('AccountingExportService', ['getAccountingExportSummary']);
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const workspaceServiceSpyObj = jasmine.createSpyObj('WorkspaceService', ['getConfiguration']);
    const intacctExportSettingServiceSpyObj = jasmine.createSpyObj('SiExportSettingService', ['getExportSettings']);
    const exportLogServiceSpyObj = jasmine.createSpyObj('ExportLogService', ['getExportLogs']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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

    fixture = TestBed.createComponent(IntacctDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  describe('IntacctDashboardComponent', () => {

    it('should handle export correctly', fakeAsync(() => {
      // Mock the necessary observables
      dashboardServiceSpy.triggerAccountingExport.and.returnValue(of({}));
      dashboardServiceSpy.getAllTasks.and.returnValue(of(mockCompletedTasks));
      dashboardServiceSpy.getExportErrors.and.returnValue(of([]));

      accountingExportServiceSpy.getAccountingExportSummary.and.returnValue(of(mockAccountingExportSummary));
  
      component.exportableAccountingExportIds = [1, 2];

      component.export();
      tick(3000);

      expect(component.isExportInProgress).toBeFalse();
      expect(component.exportProgressPercentage).toBe(0);
      expect(component.processedCount).toBe(0);
      expect(component.failedExpenseGroupCount).toBe(0);
  
      expect(dashboardServiceSpy.triggerAccountingExport).toHaveBeenCalledTimes(1);
      expect(dashboardServiceSpy.getAllTasks).toHaveBeenCalledWith([], [1, 2], component.accountingExportType, AppName.INTACCT);
      expect(dashboardServiceSpy.getExportErrors).toHaveBeenCalledWith('v1');
      expect(accountingExportServiceSpy.getAccountingExportSummary).toHaveBeenCalledWith('v1');
  
      // expect(component.isExportInProgress).toBeFalse();
      // expect(component.exportProgressPercentage).toBe(0);
      // expect(component.processedCount).toBe(0);
      // expect(component.failedExpenseGroupCount).toBe(0);
    
      // // TODO Assert DOM text
      // // await fixture.whenStable();
      // // const compiled = fixture.nativeElement as HTMLElement;
      // // console.log({compiled})
      // // expect(compiled.).toContain('You are all caught up');
      discardPeriodicTasks();
    }));
  });
});
