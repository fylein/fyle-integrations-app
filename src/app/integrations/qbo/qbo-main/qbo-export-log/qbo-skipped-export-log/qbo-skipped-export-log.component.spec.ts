import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { QboSkippedExportLogComponent } from './qbo-skipped-export-log.component';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { AccountingExportService } from 'src/app/core/services/common/accounting-export.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { mockSkippedExpenseGroup } from '../../../qbo.fixture';

describe('QboSkippedExportLogComponent', () => {
  let component: QboSkippedExportLogComponent;
  let fixture: ComponentFixture<QboSkippedExportLogComponent>;
  let exportLogService: jasmine.SpyObj<ExportLogService>;
  let accountingExportService: jasmine.SpyObj<AccountingExportService>;
  let windowService: jasmine.SpyObj<WindowService>;
  let paginatorService: jasmine.SpyObj<PaginatorService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const exportLogServiceSpy = jasmine.createSpyObj('ExportLogService', ['getSkippedExpenses']);
    const accountingExportServiceSpy = jasmine.createSpyObj('AccountingExportService', ['']);
    const windowServiceSpy = jasmine.createSpyObj('WindowService', ['']);
    const paginatorServiceSpy = jasmine.createSpyObj('PaginatorService', ['getPageSize', 'storePageSize']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);

    await TestBed.configureTestingModule({
      declarations: [ QboSkippedExportLogComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: ExportLogService, useValue: exportLogServiceSpy },
        { provide: AccountingExportService, useValue: accountingExportServiceSpy },
        { provide: WindowService, useValue: windowServiceSpy },
        { provide: PaginatorService, useValue: paginatorServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QboSkippedExportLogComponent);
    component = fixture.componentInstance;
    exportLogService = TestBed.inject(ExportLogService) as jasmine.SpyObj<ExportLogService>;
    accountingExportService = TestBed.inject(AccountingExportService) as jasmine.SpyObj<AccountingExportService>;
    windowService = TestBed.inject(WindowService) as jasmine.SpyObj<WindowService>;
    paginatorService = TestBed.inject(PaginatorService) as jasmine.SpyObj<PaginatorService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    component.skipExportLogForm = new FormBuilder().group({
      searchOption: [''],
      dateRange: [''],
      start: [null],
      end: [null]
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and load skipped expenses', () => {
    paginatorService.getPageSize.and.returnValue({ limit: 50, offset: 0 });
    exportLogService.getSkippedExpenses.and.returnValue(of(mockSkippedExpenseGroup));
    userService.getUserProfile.and.returnValue({
      org_id: 'or79Cob97KSh',
      email: '',
      access_token: '',
      refresh_token: '',
      full_name: '',
      user_id: '',
      org_name: ''
    });

    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.totalCount).toBe(4);
    expect(component.filteredExpenses.length).toBe(4);
    expect(component.expenses.length).toBe(4);
  });

  it('should handle page size changes', () => {
    component.limit = 50;
    component.offset = 0;
    exportLogService.getSkippedExpenses.and.returnValue(of(mockSkippedExpenseGroup));
    userService.getUserProfile.and.returnValue({
      org_id: 'or79Cob97KSh',
      email: '',
      access_token: '',
      refresh_token: '',
      full_name: '',
      user_id: '',
      org_name: ''
    });

    component.pageSizeChanges(25);

    expect(component.currentPage).toBe(1);
    expect(component.limit).toBe(25);
    expect(paginatorService.storePageSize).toHaveBeenCalledWith(PaginatorPage.EXPORT_LOG, 25);
  });

  it('should handle page changes', () => {
    component.limit = 50;
    exportLogService.getSkippedExpenses.and.returnValue(of(mockSkippedExpenseGroup));
    userService.getUserProfile.and.returnValue({
      org_id: 'or79Cob97KSh',
      email: '',
      access_token: '',
      refresh_token: '',
      full_name: '',
      user_id: '',
      org_name: ''
    });

    component.pageChanges(50);

    expect(component.offset).toBe(50);
    expect(component.currentPage).toBe(2);
  });

  it('should handle simple search', (done) => {
    spyOn(component, 'getSkippedExpenses');
    component.limit = 50;
    component.offset = 0;

    component.handleSimpleSearch('test query');

    setTimeout(() => {
      expect(component.searchQuery).toBe('test query');
      expect(component.offset).toBe(0);
      expect(component.currentPage).toBe(1);
      expect(component.getSkippedExpenses).toHaveBeenCalledWith(50, 0);
      done();
    }, 1100);
  });

  it('should handle date range selection', () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');
    paginatorService.getPageSize.and.returnValue({ limit: 50, offset: 0 });
    spyOn(component, 'getSkippedExpenses');
    component.skipExportLogForm.get('start')?.setValue(startDate);
    component.skipExportLogForm.get('end')?.setValue(endDate);
    component.getSkippedExpenses(50, 0);
  
    expect(component.isDateSelected).toBeTrue();
    expect(component.selectedDateFilter).toEqual({
      startDate: startDate,
      endDate: endDate
    });
    expect(component.getSkippedExpenses).toHaveBeenCalledWith(50, 0);
  });
  
  it('should handle date range reset', () => {
    paginatorService.getPageSize.and.returnValue({ limit: 50, offset: 0 });
    spyOn(component, 'getSkippedExpenses');
    component.skipExportLogForm.get('start')?.setValue(null);
    component.skipExportLogForm.get('end')?.setValue(null);
    component.getSkippedExpenses(50, 0);
  
    expect(component.isDateSelected).toBeFalse();
    expect(component.selectedDateFilter).toBeNull();
    expect(component.getSkippedExpenses).toHaveBeenCalledWith(50, 0);
  });

  it('should parse API response correctly', () => {
    paginatorService.getPageSize.and.returnValue({ limit: 50, offset: 0 });
    exportLogService.getSkippedExpenses.and.returnValue(of(mockSkippedExpenseGroup));
    userService.getUserProfile.and.returnValue({
      org_id: 'or79Cob97KSh',
      email: '',
      access_token: '',
      refresh_token: '',
      full_name: '',
      user_id: '',
      org_name: ''
    });

    fixture.detectChanges();

    const firstExpense = component.filteredExpenses[0];
    expect(firstExpense.claim_number).toBe('C/2022/04/R/9');
    expect(firstExpense.updated_at).toEqual(new Date("2024-02-23T05:30:21.570820Z"));
  });

  it('should handle pagination correctly', () => {
    paginatorService.getPageSize.and.returnValue({ limit: 50, offset: 0 });
    exportLogService.getSkippedExpenses.and.returnValue(of(mockSkippedExpenseGroup));
    userService.getUserProfile.and.returnValue({
      org_id: 'or79Cob97KSh',
      email: '',
      access_token: '',
      refresh_token: '',
      full_name: '',
      user_id: '',
      org_name: ''
    });

    fixture.detectChanges();

    expect(component.totalCount).toBe(4);
  });
});