/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { QboCompleteExportLogComponent } from './qbo-complete-export-log.component';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { AppName, PaginatorPage, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { AccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { mockExpenseGroupResponse, mockPageSize, mockUser } from 'src/app/integrations/qbo/qbo.fixture';

describe('QboCompleteExportLogComponent', () => {
  let component: QboCompleteExportLogComponent;
  let fixture: ComponentFixture<QboCompleteExportLogComponent>;
  let exportLogService: jasmine.SpyObj<ExportLogService>;
  let paginatorService: jasmine.SpyObj<PaginatorService>;
  let windowService: jasmine.SpyObj<WindowService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const exportLogServiceSpy = jasmine.createSpyObj('ExportLogService', ['getExpenseGroups']);
    const paginatorServiceSpy = jasmine.createSpyObj('PaginatorService', ['storePageSize', 'getPageSize']);
    const windowServiceSpy = jasmine.createSpyObj('WindowService', ['openInNewTab']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);

    await TestBed.configureTestingModule({
      declarations: [ QboCompleteExportLogComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: ExportLogService, useValue: exportLogServiceSpy },
        { provide: PaginatorService, useValue: paginatorServiceSpy },
        { provide: WindowService, useValue: windowServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    exportLogService = TestBed.inject(ExportLogService) as jasmine.SpyObj<ExportLogService>;
    paginatorService = TestBed.inject(PaginatorService) as jasmine.SpyObj<PaginatorService>;
    windowService = TestBed.inject(WindowService) as jasmine.SpyObj<WindowService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    userService.getUserProfile.and.returnValue(mockUser);
    paginatorService.getPageSize.and.returnValue(mockPageSize);
    exportLogService.getExpenseGroups.and.returnValue(of());

    fixture = TestBed.createComponent(QboCompleteExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.appName).toBe(AppName.QBO);
    expect(component.totalCount).toBe(0);
    expect(component.offset).toBe(0);
    expect(component.currentPage).toBe(1);
    expect(component.isDateSelected).toBeFalse();
    expect(component['org_id']).toBe(mockUser.org_id);
  });

  it('should open expense in Fyle', () => {
    const expenseId = 'txGDE32dCf';
    component.openExpenseinFyle(expenseId);
    expect(windowService.openInNewTab).toHaveBeenCalledWith(
      AccountingExportModel.getFyleExpenseUrl(expenseId)
    );
  });

  it('should handle simple search', fakeAsync(() => {
    const query = 'test query';
    component.handleSimpleSearch(query);
    tick(1000);
    expect(component.searchQuery).toBe(query);
    expect(component.offset).toBe(0);
    expect(component.currentPage).toBe(1);
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
  }));

  it('should handle page size changes', () => {
    const newLimit = 20;
    component.pageSizeChanges(newLimit);
    expect(component.isLoading).toBeTrue();
    expect(component.currentPage).toBe(1);
    expect(component.limit).toBe(newLimit);
    expect(paginatorService.storePageSize).toHaveBeenCalledWith(PaginatorPage.EXPORT_LOG, newLimit);
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
  });

  it('should handle page changes', () => {
    const newOffset = 10;
    component.pageChanges(newOffset);
    expect(component.isLoading).toBeTrue();
    expect(component.offset).toBe(newOffset);
    expect(component.currentPage).toBe(2);
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
  });

  it('should setup form correctly', () => {
    expect(component.exportLogForm).toBeDefined();
    expect(component.exportLogForm.get('searchOption')).toBeDefined();
    expect(component.exportLogForm.get('dateRange')).toBeDefined();
    expect(component.exportLogForm.get('start')).toBeDefined();
    expect(component.exportLogForm.get('end')).toBeDefined();
  });

  it('should handle date range changes', fakeAsync(() => {
    const dateRange = [new Date(), new Date()];
    component.exportLogForm.get('start')?.setValue(dateRange);
    tick(10);
    expect(component.selectedDateFilter).toBeDefined();
    expect(component.isDateSelected).toBeTrue();
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
  }));

  it('should handle null date range', fakeAsync(() => {
    component.exportLogForm.get('start')?.setValue(null);
    tick();
    expect(component.selectedDateFilter).toBeNull();
    expect(component.isDateSelected).toBeFalse();
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
  }));

  it('should parse expense group API response correctly', () => {
    exportLogService.getExpenseGroups.and.returnValue(of(mockExpenseGroupResponse));
    component['getAccountingExports'](10, 0);

    expect(component.totalCount).toBe(mockExpenseGroupResponse.count);
    expect(component.filteredAccountingExports.length).toBe(mockExpenseGroupResponse.results.length);
    expect(component.accountingExports.length).toBe(mockExpenseGroupResponse.results.length);

    // Check if the first expense group is parsed correctly
    const firstExpenseGroup = mockExpenseGroupResponse.results[0];
    expect(firstExpenseGroup.expenses.length).toBe(component.filteredAccountingExports[0].expenses.length);

    // Check if the expense details are parsed correctly
    const firstExpense = firstExpenseGroup.expenses[0];
    expect(firstExpense.expense_number).toBe(mockExpenseGroupResponse.results[0].expenses[0].expense_number);
    expect(firstExpense.amount).toBe(mockExpenseGroupResponse.results[0].expenses[0].amount);
    expect(firstExpense.currency).toBe(mockExpenseGroupResponse.results[0].expenses[0].currency);
    expect(firstExpense.category).toBe(mockExpenseGroupResponse.results[0].expenses[0].category);
    expect(firstExpense.expense_id).toBe(mockExpenseGroupResponse.results[0].expenses[0].expense_id);

    // Check if the response logs are parsed correctly
    expect(firstExpenseGroup.response_logs).toEqual(mockExpenseGroupResponse.results[0].response_logs);

    // Check if the dates are parsed correctly
    expect(firstExpenseGroup.created_at).toEqual(new Date(mockExpenseGroupResponse.results[0].created_at));
    expect(firstExpenseGroup.exported_at).toEqual(new Date(mockExpenseGroupResponse.results[0].exported_at));
    expect(firstExpenseGroup.updated_at).toEqual(new Date(mockExpenseGroupResponse.results[0].updated_at));
  });
});