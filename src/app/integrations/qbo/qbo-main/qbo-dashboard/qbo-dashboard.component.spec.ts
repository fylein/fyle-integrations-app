/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { QboDashboardComponent } from './qbo-dashboard.component';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';
import { of, throwError } from 'rxjs';
import { AppName, TaskLogState, QBOTaskLogType, ReimbursableImportState, CCCImportState } from 'src/app/core/models/enum/enum.model';
import { mockWorkspaceGeneralSettingsForDashboard, mockExportableExpenseGroup, mockExportSettingsForDashboard, mockImportSettingsForDashboard, mockExportErrors, mockQBOTaskResponse, mockAccountingExportSummary, mockExportSettings, mockQBOEnqueuedTaskResponse, mockQBOCompletedTaskResponse } from 'src/app/integrations/qbo/qbo.fixture';
import { DashboardModel } from 'src/app/core/models/db/dashboard.model';
import { AccountingExportSummary, AccountingExportSummaryModel } from 'src/app/core/models/db/accounting-export-summary.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { QBOImportSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { QBOExportSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';

describe('QboDashboardComponent', () => {
  let component: QboDashboardComponent;
  let fixture: ComponentFixture<QboDashboardComponent>;
  let accountingExportService: jasmine.SpyObj<AccountingExportService>;
  let dashboardService: jasmine.SpyObj<DashboardService>;
  let workspaceService: jasmine.SpyObj<WorkspaceService>;
  let qboExportSettingsService: jasmine.SpyObj<QboExportSettingsService>;
  let importSettingService: jasmine.SpyObj<QboImportSettingsService>;

  beforeEach(async () => {
    const accountingExportServiceSpy = jasmine.createSpyObj('AccountingExportService', ['getAccountingExportSummary', 'importExpensesFromFyle']);
    const dashboardServiceSpy = jasmine.createSpyObj('DashboardService', ['getExportErrors', 'getAllTasks', 'getExportableAccountingExportIds', 'triggerAccountingExport']);
    const workspaceServiceSpy = jasmine.createSpyObj('WorkspaceService', ['getWorkspaceGeneralSettings']);
    const qboExportSettingsServiceSpy = jasmine.createSpyObj('QboExportSettingsService', ['getExportSettings']);
    const importSettingServiceSpy = jasmine.createSpyObj('QboImportSettingsService', ['getImportSettings']);

    await TestBed.configureTestingModule({
      declarations: [ QboDashboardComponent ],
      providers: [
        { provide: AccountingExportService, useValue: accountingExportServiceSpy },
        { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: WorkspaceService, useValue: workspaceServiceSpy },
        { provide: QboExportSettingsService, useValue: qboExportSettingsServiceSpy },
        { provide: QboImportSettingsService, useValue: importSettingServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    accountingExportService = TestBed.inject(AccountingExportService) as jasmine.SpyObj<AccountingExportService>;
    dashboardService = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
    workspaceService = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
    qboExportSettingsService = TestBed.inject(QboExportSettingsService) as jasmine.SpyObj<QboExportSettingsService>;
    importSettingService = TestBed.inject(QboImportSettingsService) as jasmine.SpyObj<QboImportSettingsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.isLoading).toBeTrue();
    expect(component.appName).toBe(AppName.QBO);
    expect(component.isImportInProgress).toBeTrue();
    expect(component.isExportInProgress).toBeFalse();
    expect(component.exportableAccountingExportIds).toEqual([]);
    expect(component.failedExpenseGroupCount).toBe(0);
    expect(component.exportProgressPercentage).toBe(0);
    expect(component.accountingExportSummary).toBeUndefined();
    expect(component.processedCount).toBe(0);
  });

  it('should setup page correctly', fakeAsync(() => {
    dashboardService.getExportErrors.and.returnValue(of(mockExportErrors));
    accountingExportService.getAccountingExportSummary.and.returnValue(of(mockAccountingExportSummary));
    dashboardService.getAllTasks.and.returnValue(of(mockQBOTaskResponse));
    workspaceService.getWorkspaceGeneralSettings.and.returnValue(of(mockWorkspaceGeneralSettingsForDashboard));
    dashboardService.getExportableAccountingExportIds.and.returnValue(of(mockExportableExpenseGroup));
    qboExportSettingsService.getExportSettings.and.returnValue(of(mockExportSettingsForDashboard as QBOExportSettingGet));
    importSettingService.getImportSettings.and.returnValue(of(mockImportSettingsForDashboard as QBOImportSettingGet));
    accountingExportService.importExpensesFromFyle.and.returnValue(of({}));
    qboExportSettingsService.getExportSettings.and.returnValue(of(mockExportSettings));
    component.getExportErrors$ = of(mockExportErrors);
    component.getAccountingExportSummary$ = of(mockAccountingExportSummary);

    component.ngOnInit();
    tick();
    component.getAccountingExportSummary$ = of(mockAccountingExportSummary);
    expect(component.errors).toEqual(DashboardModel.parseAPIResponseToGroupedError(mockExportErrors));
    expect(component.isImportItemsEnabled).toBe(mockWorkspaceGeneralSettingsForDashboard.import_items);
    expect(component.accountingExportSummary).toEqual(AccountingExportSummaryModel.parseAPIResponseToAccountingSummary(mockAccountingExportSummary));
    expect(component.destinationFieldMap).toEqual({
      EMPLOYEE: mockWorkspaceGeneralSettingsForDashboard.employee_field_mapping,
      CATEGORY: 'ACCOUNT'
    });
    expect(component.isLoading).toBeFalse();
    expect(component.importCodeFields).toEqual(mockImportSettingsForDashboard.workspace_general_settings.import_code_fields);
    expect(component.exportableAccountingExportIds).toEqual(mockExportableExpenseGroup.exportable_expense_group_ids);
    expect(component.failedExpenseGroupCount).toBe(12);
    expect(component.reimbursableImportState).toBe(ReimbursableImportState.PROCESSING);
    expect(component.cccImportState).toBe(CCCImportState.APPROVED);
    expect(component.isImportInProgress).toBeFalse();
  }));

  it('should set reimbursableImportState to null when reimbursable_expenses_object is falsy', fakeAsync(() => {
    const modifiedSettings = { ...mockExportSettingsForDashboard };
    modifiedSettings.workspace_general_settings.reimbursable_expenses_object = null as unknown as string;

    dashboardService.getExportErrors.and.returnValue(of(mockExportErrors));
    accountingExportService.getAccountingExportSummary.and.returnValue(of(mockAccountingExportSummary));
    dashboardService.getAllTasks.and.returnValue(of(mockQBOTaskResponse));
    workspaceService.getWorkspaceGeneralSettings.and.returnValue(of(mockWorkspaceGeneralSettingsForDashboard));
    dashboardService.getExportableAccountingExportIds.and.returnValue(of(mockExportableExpenseGroup));
    qboExportSettingsService.getExportSettings.and.returnValue(of(modifiedSettings as QBOExportSettingGet));
    importSettingService.getImportSettings.and.returnValue(of(mockImportSettingsForDashboard as QBOImportSettingGet));
    accountingExportService.importExpensesFromFyle.and.returnValue(of({}));

    component.getExportErrors$ = of(mockExportErrors);
    component.getAccountingExportSummary$ = of(mockAccountingExportSummary);

    component.ngOnInit();
    tick();

    expect(component.reimbursableImportState).toBeNull();
  }));

  it('should set cccImportState to null when corporate_credit_card_expenses_object is falsy', fakeAsync(() => {
    const modifiedSettings = { ...mockExportSettingsForDashboard };
    modifiedSettings.workspace_general_settings.corporate_credit_card_expenses_object = null as unknown as string;

    dashboardService.getExportErrors.and.returnValue(of(mockExportErrors));
    accountingExportService.getAccountingExportSummary.and.returnValue(of(mockAccountingExportSummary));
    dashboardService.getAllTasks.and.returnValue(of(mockQBOTaskResponse));
    workspaceService.getWorkspaceGeneralSettings.and.returnValue(of(mockWorkspaceGeneralSettingsForDashboard));
    dashboardService.getExportableAccountingExportIds.and.returnValue(of(mockExportableExpenseGroup));
    qboExportSettingsService.getExportSettings.and.returnValue(of(modifiedSettings as QBOExportSettingGet));
    importSettingService.getImportSettings.and.returnValue(of(mockImportSettingsForDashboard as QBOImportSettingGet));
    accountingExportService.importExpensesFromFyle.and.returnValue(of({}));

    component.getExportErrors$ = of(mockExportErrors);
    component.getAccountingExportSummary$ = of(mockAccountingExportSummary);

    component.ngOnInit();
    tick();

    expect(component.cccImportState).toBeNull();
  }));

  it('should handle error in getAccountingExportSummary', fakeAsync(() => {
    dashboardService.getExportErrors.and.returnValue(of(mockExportErrors));
    dashboardService.getAllTasks.and.returnValue(of(mockQBOTaskResponse));
    workspaceService.getWorkspaceGeneralSettings.and.returnValue(of(mockWorkspaceGeneralSettingsForDashboard));
    dashboardService.getExportableAccountingExportIds.and.returnValue(of(mockExportableExpenseGroup));
    qboExportSettingsService.getExportSettings.and.returnValue(of(mockExportSettingsForDashboard as QBOExportSettingGet));
    importSettingService.getImportSettings.and.returnValue(of(mockImportSettingsForDashboard as QBOImportSettingGet));
    accountingExportService.importExpensesFromFyle.and.returnValue(of({}));

    component.getExportErrors$ = of(mockExportErrors);
    component.getAccountingExportSummary$ = throwError(() => new Error('API error'));

    component.ngOnInit();
    tick();

    expect(component.accountingExportSummary).toBeUndefined();
  }));

  it('should trigger export and poll export status', fakeAsync(() => {
    dashboardService.triggerAccountingExport.and.returnValue(of({}));
    dashboardService.getAllTasks.and.returnValue(of(mockQBOCompletedTaskResponse));

    component.getExportErrors$ = of([]);
    component.getAccountingExportSummary$ = of(mockAccountingExportSummary);

    component.exportableAccountingExportIds = [1];
    component.export();
    tick(3000);

    expect(component.isExportInProgress).toBeFalse();
    expect(component.exportProgressPercentage).toBe(0);
    expect(component.processedCount).toBe(0);
    expect(dashboardService.triggerAccountingExport).toHaveBeenCalledTimes(1);
    expect(dashboardService.getAllTasks).toHaveBeenCalledTimes(1);
  }));

  it('should handle export with failed tasks', fakeAsync(() => {
    dashboardService.triggerAccountingExport.and.returnValue(of({}));
    dashboardService.getAllTasks.and.returnValue(of(mockQBOTaskResponse));

    component.getExportErrors$ = of([]);
    component.getAccountingExportSummary$ = of(mockAccountingExportSummary);

    component.exportableAccountingExportIds = [16078, 16081];
    component.export();
    tick(3000);

    expect(component.failedExpenseGroupCount).toBe(12);
    expect(component.exportableAccountingExportIds).toEqual(mockQBOTaskResponse.results.filter(task => task.status === TaskLogState.FAILED || task.status === TaskLogState.FATAL).map(task => task.expense_group));
    expect(component.isExportInProgress).toBeFalse();
    expect(component.exportProgressPercentage).toBe(0);
    expect(component.processedCount).toBe(0);
  }));

  it('should setup page with error handling', fakeAsync(() => {
    dashboardService.getExportErrors.and.returnValue(of(mockExportErrors));
    accountingExportService.getAccountingExportSummary.and.returnValue(throwError(() => new Error('API error')));
    dashboardService.getAllTasks.and.returnValue(of(mockQBOTaskResponse));
    workspaceService.getWorkspaceGeneralSettings.and.returnValue(of(mockWorkspaceGeneralSettingsForDashboard));
    dashboardService.getExportableAccountingExportIds.and.returnValue(of(mockExportableExpenseGroup));

    // Modify the mock settings to have empty strings for reimbursable and corporate credit card expenses objects
    const modifiedSettings = { ...mockExportSettingsForDashboard };
    modifiedSettings.workspace_general_settings.reimbursable_expenses_object = '';
    modifiedSettings.workspace_general_settings.corporate_credit_card_expenses_object = '';
    qboExportSettingsService.getExportSettings.and.returnValue(of(modifiedSettings as QBOExportSettingGet));

    importSettingService.getImportSettings.and.returnValue(of(mockImportSettingsForDashboard as QBOImportSettingGet));
    accountingExportService.importExpensesFromFyle.and.returnValue(of({}));

    component.getExportErrors$ = of(mockExportErrors);
    component.getAccountingExportSummary$ = throwError(() => new Error('API error'));

    component.ngOnInit();
    tick();
    component.getAccountingExportSummary$ = of(mockAccountingExportSummary);
    expect(component.failedExpenseGroupCount).toBe(12);
    expect(component.reimbursableImportState).toBeNull();
    expect(component.cccImportState).toBeNull();
    expect(component.accountingExportSummary).toBeUndefined();
    expect(component.isLoading).toBeFalse();
    expect(component.isImportInProgress).toBeFalse();
    expect(component.isExportInProgress).toBeFalse();
  }));

  it('should handle queued tasks and start polling export status', fakeAsync(() => {
    dashboardService.getExportErrors.and.returnValue(of(mockExportErrors));
    accountingExportService.getAccountingExportSummary.and.returnValue(of(mockAccountingExportSummary));
    dashboardService.getAllTasks.and.returnValue(of(mockQBOEnqueuedTaskResponse));
    workspaceService.getWorkspaceGeneralSettings.and.returnValue(of(mockWorkspaceGeneralSettingsForDashboard));
    dashboardService.getExportableAccountingExportIds.and.returnValue(of(mockExportableExpenseGroup));
    qboExportSettingsService.getExportSettings.and.returnValue(of(mockExportSettingsForDashboard as QBOExportSettingGet));
    importSettingService.getImportSettings.and.returnValue(of(mockImportSettingsForDashboard as QBOImportSettingGet));
    accountingExportService.importExpensesFromFyle.and.returnValue(of({}));

    component.getExportErrors$ = of(mockExportErrors);
    component.getAccountingExportSummary$ = of(mockAccountingExportSummary);

    spyOn<any>(component, 'pollExportStatus').and.callThrough();

    component.ngOnInit();
    tick();

    expect(component.isExportInProgress).toBeTrue();
    expect(component['pollExportStatus']).toHaveBeenCalledWith(mockExportableExpenseGroup.exportable_expense_group_ids);

    // Simulate completion of tasks
    dashboardService.getAllTasks.and.returnValue(of(mockQBOCompletedTaskResponse));

    tick(6000);
    discardPeriodicTasks();

    expect(component.isExportInProgress).toBeFalse();
  }));
});