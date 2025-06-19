import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { IntacctSkipExportLogComponent } from './intacct-skip-export-log.component';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { mockSkipExportLogResponse, mockPaginator } from '../../../intacct.fixture';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoService } from '@jsverse/transloco';

describe('IntacctSkipExportLogComponent', () => {
  let component: IntacctSkipExportLogComponent;
  let fixture: ComponentFixture<IntacctSkipExportLogComponent>;
  let exportLogService: jasmine.SpyObj<ExportLogService>;
  let trackingService: jasmine.SpyObj<TrackingService>;
  let paginatorService: jasmine.SpyObj<PaginatorService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const exportLogServiceSpy = jasmine.createSpyObj('ExportLogService', ['getSkippedExpenses']);
    const trackingServiceSpy = jasmine.createSpyObj('TrackingService', ['onDateFilter']);
    const paginatorServiceSpy = jasmine.createSpyObj('PaginatorService', ['getPageSize', 'storePageSize']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserProfile']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, SharedModule ],
      declarations: [ IntacctSkipExportLogComponent ],
      providers: [
        FormBuilder,
        { provide: ExportLogService, useValue: exportLogServiceSpy },
        { provide: TrackingService, useValue: trackingServiceSpy },
        { provide: PaginatorService, useValue: paginatorServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    }).compileComponents();

    exportLogService = TestBed.inject(ExportLogService) as jasmine.SpyObj<ExportLogService>;
    trackingService = TestBed.inject(TrackingService) as jasmine.SpyObj<TrackingService>;
    paginatorService = TestBed.inject(PaginatorService) as jasmine.SpyObj<PaginatorService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntacctSkipExportLogComponent);
    component = fixture.componentInstance;
    userService.getUserProfile.and.returnValue({ org_id: 'ORG123' } as MinimalUser);
    paginatorService.getPageSize.and.returnValue(mockPaginator);
    exportLogService.getSkippedExpenses.and.returnValue(of(mockSkipExportLogResponse));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and load data', () => {
    component.ngOnInit();
    expect(component.limit).toBe(mockPaginator.limit);
    expect(component.offset).toBe(mockPaginator.offset);
    expect(component.isLoading).toBeFalse();
    expect(component.totalCount).toBe(mockSkipExportLogResponse.count);
    expect(component.filteredExpenses.length).toBe(mockSkipExportLogResponse.results.length);
    expect(component.filteredExpenses).toEqual(component.expenses);
  });

  it('should handle page size changes', () => {
    const newLimit = 20;
    component.pageSizeChanges(newLimit);
    expect(component.limit).toBe(newLimit);
    expect(component.currentPage).toBe(1);
    expect(paginatorService.storePageSize).toHaveBeenCalledWith(PaginatorPage.EXPORT_LOG, newLimit);
    expect(exportLogService.getSkippedExpenses).toHaveBeenCalled();
  });

  it('should handle page changes', () => {
    fixture.detectChanges();
    const newOffset = 10;
    component.pageChanges(newOffset);
    expect(component.offset).toBe(newOffset);
    expect(component.currentPage).toBe(2);
    expect(exportLogService.getSkippedExpenses).toHaveBeenCalled();
  });

  it('should handle simple search', fakeAsync(() => {
    fixture.detectChanges();
    const searchQuery = 'test query';
    component.handleSimpleSearch(searchQuery);
    tick(1000);
    expect(component.searchQuery).toBe(searchQuery);
    expect(component.offset).toBe(0);
    expect(component.currentPage).toBe(1);
    expect(exportLogService.getSkippedExpenses).toHaveBeenCalled();
  }));

  it('should handle date filter changes', fakeAsync(() => {
    component.ngOnInit();
    const dateRange = [new Date('2023-01-01'), new Date('2023-01-31')];
    component.skipExportLogForm.controls.start.setValue(dateRange);
    tick(10);
    expect(component.selectedDateFilter).toEqual({
      startDate: dateRange[0],
      endDate: dateRange[1]
    });
    expect(component.isDateSelected).toBeTrue();
    expect(exportLogService.getSkippedExpenses).toHaveBeenCalled();
  }));

  it('should clear date filter when null is set', fakeAsync(() => {
    component.ngOnInit();
    component.skipExportLogForm.controls.start.setValue(null);
    tick(10);
    expect(component.selectedDateFilter).toBeNull();
    expect(component.isDateSelected).toBeFalse();
    expect(exportLogService.getSkippedExpenses).toHaveBeenCalled();
  }));

  it('should call getSkippedExpenses with correct parameters', () => {
    fixture.detectChanges();
    expect(exportLogService.getSkippedExpenses).toHaveBeenCalledWith(
      mockPaginator.limit,
      mockPaginator.offset,
      undefined,
      undefined
    );
  });

  it('should track date filter', () => {
    const dateFilter = { startDate: new Date('2023-01-01'), endDate: new Date('2023-01-31') };
    (component as any).trackDateFilter('custom', dateFilter);
    expect(trackingService.onDateFilter).toHaveBeenCalledWith(jasmine.any(String), jasmine.objectContaining(dateFilter));
  });

  it('should set hideCalendar to false after timeout', fakeAsync(() => {
    component.ngOnInit();
    const dateRange = [new Date('2023-01-01'), new Date('2023-01-31')];
    component.skipExportLogForm.controls.start.setValue(dateRange);
    expect(component.hideCalendar).toBeTrue();
    tick(10);
    expect(component.hideCalendar).toBeFalse();
  }));
});