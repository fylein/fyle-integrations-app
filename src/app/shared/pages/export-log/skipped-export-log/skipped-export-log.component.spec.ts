/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SkippedExportLogComponent } from './skipped-export-log.component';
import { UserService } from 'src/app/core/services/misc/user.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { mockSkippedExpenseGroup, mockSkippedExpenseGroupWithDateRange, mockPaginator, mockUserProfile } from 'src/app/integrations/qbo/qbo.fixture';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';

describe('SkippedExportLogComponent', () => {
  let component: SkippedExportLogComponent;
  let fixture: ComponentFixture<SkippedExportLogComponent>;
  let exportLogService: jasmine.SpyObj<ExportLogService>;
  let userService: jasmine.SpyObj<UserService>;
  let paginatorService: jasmine.SpyObj<PaginatorService>;
  let accountingExportService: jasmine.SpyObj<AccountingExportService>;

  beforeEach(async () => {
    const exportLogServiceSpy = jasmine.createSpyObj('ExportLogService', ['getSkippedExpenses']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const paginatorServiceSpy = jasmine.createSpyObj('PaginatorService', ['getPageSize', 'storePageSize']);
    const accountingExportServiceSpy = jasmine.createSpyObj('AccountingExportService', ['getDateOptionsV2']);

    accountingExportServiceSpy.getDateOptionsV2.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [ SkippedExportLogComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: ExportLogService, useValue: exportLogServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AccountingExportService, useValue: accountingExportServiceSpy },
        { provide: WindowService, useValue: {} },
        { provide: PaginatorService, useValue: paginatorServiceSpy }
      ]
    }).compileComponents();

    exportLogService = TestBed.inject(ExportLogService) as jasmine.SpyObj<ExportLogService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    paginatorService = TestBed.inject(PaginatorService) as jasmine.SpyObj<PaginatorService>;
    accountingExportService = TestBed.inject(AccountingExportService) as jasmine.SpyObj<AccountingExportService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkippedExportLogComponent);
    component = fixture.componentInstance;
    userService.getUserProfile.and.returnValue(mockUserProfile);
    paginatorService.getPageSize.and.returnValue(mockPaginator);
    exportLogService.getSkippedExpenses.and.returnValue(of(mockSkippedExpenseGroup));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', () => {
    expect(component.isLoading).toBeFalse();
    expect(component.totalCount).toBe(mockSkippedExpenseGroup.count);
    expect(component.expenses.length).toBe(mockSkippedExpenseGroup.results.length);
    expect(component.limit).toBe(mockPaginator.limit);
    expect(component.offset).toBe(mockPaginator.offset);
  });

  it('should handle simple search', fakeAsync(() => {
    const searchQuery = 'anish';
    component.handleSimpleSearch(searchQuery);
    tick(1000);
    expect(component.searchQuery).toBe(searchQuery);
    expect(component.offset).toBe(0);
    expect(component.currentPage).toBe(1);
  }));

  it('should handle page size changes', () => {
    const newLimit = 100;
    component.pageSizeChanges(newLimit);
    expect(component.isLoading).toBeFalse();
    expect(component.currentPage).toBe(1);
    expect(component.limit).toBe(newLimit);
    expect(paginatorService.storePageSize).toHaveBeenCalledWith(PaginatorPage.EXPORT_LOG, newLimit);
  });

  it('should handle page changes', () => {
    const newOffset = 50;
    component.limit = 50;
    component.pageChanges(newOffset);
    expect(component.isLoading).toBeFalse();
    expect(component.offset).toBe(newOffset);
    expect(component.currentPage).toBe(2);
  });

  it('should handle date range selection and hide/show calendar', fakeAsync(() => {
    const startDate = new Date('2023-06-15');
    const endDate = new Date('2023-06-16');

    component.skipExportLogForm.controls.start.setValue([startDate, endDate]);
    tick();

    expect(component.isDateSelected).toBeTrue();
    expect(component.selectedDateFilter).toEqual({ startDate, endDate });
    expect(component.hideCalendar).toBeTrue();

    tick(10);

    expect(component.hideCalendar).toBeFalse();
  }));

  it('should handle date range reset', fakeAsync(() => {
    component.skipExportLogForm.controls.start.setValue(null);
    tick();
    expect(component.isDateSelected).toBeFalse();
    expect(component.selectedDateFilter).toBeNull();
  }));

  it('should filter expenses based on date range', fakeAsync(() => {
    const startDate = new Date('2023-06-15');
    const endDate = new Date('2023-06-16');
    exportLogService.getSkippedExpenses.and.returnValue(of(mockSkippedExpenseGroupWithDateRange));

    component.skipExportLogForm.controls.start.setValue([startDate, endDate]);

    tick();
    tick(10);

    expect(component.filteredExpenses.length).toBe(mockSkippedExpenseGroupWithDateRange.results.length);
    expect(component.totalCount).toBe(mockSkippedExpenseGroupWithDateRange.count);
    expect(component.hideCalendar).toBeFalse();

    flush();
  }));
});