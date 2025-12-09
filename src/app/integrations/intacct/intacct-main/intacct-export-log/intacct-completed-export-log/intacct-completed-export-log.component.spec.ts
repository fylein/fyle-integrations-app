import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { IntacctCompletedExportLogComponent } from './intacct-completed-export-log.component';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { mockExpenseGroupResponse, mockPaginator } from '../../../intacct.fixture';
import { PaginatorPage, TaskLogState } from 'src/app/core/models/enum/enum.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoService } from '@jsverse/transloco';

describe('IntacctCompletedExportLogComponent', () => {
  let component: IntacctCompletedExportLogComponent;
  let fixture: ComponentFixture<IntacctCompletedExportLogComponent>;
  let exportLogService: jasmine.SpyObj<ExportLogService>;
  let trackingService: jasmine.SpyObj<TrackingService>;
  let paginatorService: jasmine.SpyObj<PaginatorService>;
  let userService: jasmine.SpyObj<UserService>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const exportLogServiceSpy = jasmine.createSpyObj('ExportLogService', ['getExpenseGroups']);
    const trackingServiceSpy = jasmine.createSpyObj('TrackingService', ['onDateFilter']);
    const paginatorServiceSpy = jasmine.createSpyObj('PaginatorService', ['getPageSize', 'storePageSize']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true,
      },
      langChanges$: of('en'),
      _loadDependencies: () => Promise.resolve(),
    });

    await TestBed.configureTestingModule({
      declarations: [IntacctCompletedExportLogComponent],
      imports: [ReactiveFormsModule, SharedModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ExportLogService, useValue: exportLogServiceSpy },
        { provide: TrackingService, useValue: trackingServiceSpy },
        { provide: PaginatorService, useValue: paginatorServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: TranslocoService, useValue: translocoServiceSpy },
      ],
    }).compileComponents();

    exportLogService = TestBed.inject(ExportLogService) as jasmine.SpyObj<ExportLogService>;
    trackingService = TestBed.inject(TrackingService) as jasmine.SpyObj<TrackingService>;
    paginatorService = TestBed.inject(PaginatorService) as jasmine.SpyObj<PaginatorService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;

    userService.getUserProfile.and.returnValue({ org_id: 'ORG123' } as MinimalUser);
    paginatorService.getPageSize.and.returnValue(mockPaginator);
    exportLogService.getExpenseGroups.and.returnValue(of(mockExpenseGroupResponse));

    fixture = TestBed.createComponent(IntacctCompletedExportLogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and load data', () => {
    component.ngOnInit();
    expect(component.limit).toBe(mockPaginator.limit);
    expect(component.offset).toBe(mockPaginator.offset);
    expect(component.isLoading).toBeFalse();
    expect(component.totalCount).toBe(mockExpenseGroupResponse.count);
    expect(component.filteredAccountingExports.length).toBe(mockExpenseGroupResponse.results.length);
    expect(component.filteredAccountingExports).toEqual(component.accountingExports);
  });

  it('should handle page size changes', () => {
    const newLimit = 20;
    component.pageSizeChanges(newLimit);
    expect(component.limit).toBe(newLimit);
    expect(component.currentPage).toBe(1);
    expect(paginatorService.storePageSize).toHaveBeenCalledWith(PaginatorPage.EXPORT_LOG, newLimit);
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
  });

  it('should handle page changes', () => {
    fixture.detectChanges();
    component.pageChanges(10);
    expect(component.offset).toBe(10);
    expect(component.currentPage).toBe(2);
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
  });

  it('should handle simple search', fakeAsync(() => {
    const searchQuery = 'test query';
    fixture.detectChanges();
    component.handleSimpleSearch(searchQuery);
    tick(1000);
    expect(component.searchQuery).toBe(searchQuery);
    expect(component.offset).toBe(0);
    expect(component.currentPage).toBe(1);
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
  }));

  it('should open expense in Fyle', () => {
    const expenseId = 'exp123';
    spyOn(window, 'open');
    component.openExpenseinFyle(expenseId);
    expect(window.open).toHaveBeenCalledWith(jasmine.stringContaining(expenseId), '_blank');
  });

  it('should handle date filter changes', fakeAsync(() => {
    component.ngOnInit();
    const dateRange = [new Date('2023-01-01'), new Date('2023-01-31')];
    component.exportLogForm.controls.start.setValue(dateRange);
    tick(10);
    expect(component.selectedDateFilter).toEqual({
      startDate: dateRange[0],
      endDate: dateRange[1],
    });
    expect(component.isDateSelected).toBeTrue();
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
    expect(component.hideCalendar).toBeFalse();
  }));

  it('should clear date filter when null is set', fakeAsync(() => {
    fixture.detectChanges();
    component.exportLogForm.controls.start.setValue(null);
    tick(10);
    expect(component.selectedDateFilter).toBeNull();
    expect(component.isDateSelected).toBeFalse();
    expect(exportLogService.getExpenseGroups).toHaveBeenCalled();
  }));

  it('should call getExpenseGroups with correct parameters', () => {
    component.ngOnInit();
    expect(exportLogService.getExpenseGroups).toHaveBeenCalledWith(
      TaskLogState.COMPLETE,
      mockPaginator.limit,
      mockPaginator.offset,
      undefined,
      null,
      undefined,
    );
  });

  it('should track date filter', () => {
    const dateFilter = { startDate: new Date('2023-01-01'), endDate: new Date('2023-01-31') };
    (component as any).trackDateFilter('custom', dateFilter);
    expect(trackingService.onDateFilter).toHaveBeenCalledWith(
      jasmine.any(String),
      jasmine.objectContaining(dateFilter),
    );
  });
});
